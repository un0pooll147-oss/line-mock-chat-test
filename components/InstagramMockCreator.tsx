"use client";

import React, { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bookmark,
  Heart,
  Home,
  Image as ImageIcon,
  MessageCircle,
  MoreHorizontal,
  Palette,
  Plus,
  Search,
  Send,
  Settings2,
  Upload,
  UserCircle2,
  X,
} from "lucide-react";

type InstagramScreenType = "post" | "story";
type SettingsTab = "create" | "screen" | "modes";

type InstagramSettings = {
  screenType: InstagramScreenType;
  username: string;
  displayName: string;
  avatarLabel: string;
  avatarImage: string | null;
  postImage: string | null;
  caption: string;
  likeCount: string;
  commentCount: string;
  postTime: string;
  storyImage: string | null;
  storyText: string;
  storyReplyPlaceholder: string;
  deviceTime: string;
  fullScreenMode: boolean;
  deviceFrameMode: boolean;
  showSettingsButton: boolean;
  bgColor: string;
};

const STORAGE_KEY = "instagram-mock-settings-v1";

const defaultSettings: InstagramSettings = {
  screenType: "post",
  username: "misaki_film",
  displayName: "美咲",
  avatarLabel: "美",
  avatarImage: null,
  postImage: null,
  caption: "今日の撮影、少しだけ特別な時間だった。",
  likeCount: "128",
  commentCount: "12",
  postTime: "22:18",
  storyImage: null,
  storyText: "今日はありがとう。",
  storyReplyPlaceholder: "メッセージを送信",
  deviceTime: "22:18",
  fullScreenMode: false,
  deviceFrameMode: false,
  showSettingsButton: true,
  bgColor: "#ffffff",
};

const cn = (...classes: Array<string | false | null | undefined>) => classes.filter(Boolean).join(" ");

const readStoredSettings = (): InstagramSettings => {
  if (typeof window === "undefined") return defaultSettings;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultSettings;
    const parsed = JSON.parse(raw);
    return { ...defaultSettings, ...parsed };
  } catch {
    return defaultSettings;
  }
};

function Button({ children, className = "", variant = "default", type = "button", ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "default" | "outline" | "dark" }) {
  const base = "inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-medium transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50";
  const styles =
    variant === "outline"
      ? "border border-black/10 bg-white text-black hover:bg-black/[0.03]"
      : variant === "dark"
        ? "bg-black text-white hover:bg-black/85"
        : "bg-[#06C755] text-white hover:brightness-95";
  return <button type={type} className={cn(base, styles, className)} {...props}>{children}</button>;
}

function Input({ className = "", ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} autoComplete="off" className={cn("w-full rounded-2xl border border-black/10 bg-white px-3 py-2 text-sm outline-none transition focus:border-black/20 focus:ring-2 focus:ring-black/5", className)} />;
}

function Textarea({ className = "", ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={cn("min-h-[96px] w-full rounded-2xl border border-black/10 bg-white px-3 py-2 text-sm outline-none transition focus:border-black/20 focus:ring-2 focus:ring-black/5", className)} />;
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="text-sm font-medium text-black/80">{children}</label>;
}

function Switch({ checked, onCheckedChange }: { checked: boolean; onCheckedChange: (next: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onCheckedChange(!checked)}
      className={cn("relative h-7 w-12 rounded-full transition", checked ? "bg-[#06C755]" : "bg-black/15")}
      aria-pressed={checked}
    >
      <span className={cn("absolute top-1 h-5 w-5 rounded-full bg-white shadow transition", checked ? "left-6" : "left-1")} />
    </button>
  );
}

function FileButton({ children, accept, onFile }: { children: React.ReactNode; accept: string; onFile: (event: ChangeEvent<HTMLInputElement>) => void }) {
  return (
    <label className="inline-flex cursor-pointer items-center justify-center rounded-2xl border border-black/10 bg-white px-4 py-2 text-sm font-medium text-black transition active:scale-[0.98]">
      <Upload className="mr-2 h-4 w-4" />
      {children}
      <input type="file" accept={accept} onChange={onFile} className="hidden" />
    </label>
  );
}

function SectionCard({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-black/10 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-black/80">
        <Icon className="h-4 w-4" />
        {title}
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn("rounded-2xl px-3 py-2 text-xs font-medium transition", active ? "bg-white text-black shadow-sm" : "text-black/55")}
    >
      {children}
    </button>
  );
}

function Avatar({ label, image, size = "h-9 w-9" }: { label: string; image: string | null; size?: string }) {
  return (
    <div className={cn("flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-pink-500 via-orange-400 to-yellow-300 text-sm font-bold text-white", size)}>
      {image ? <img src={image} alt="avatar" className="h-full w-full object-cover" /> : <span>{label || "美"}</span>}
    </div>
  );
}

function StatusBar({ time }: { time: string }) {
  return (
    <div className="flex h-9 items-center justify-between px-5 text-[13px] font-semibold text-black">
      <span>{time}</span>
      <div className="flex items-center gap-1.5">
        <span className="h-2 w-3 rounded-sm border border-black/80" />
        <span className="h-2 w-3 rounded-sm border border-black/80 bg-black/80" />
        <span className="text-[12px]">100</span>
      </div>
    </div>
  );
}

function EmptyImage({ label }: { label: string }) {
  return (
    <div className="flex aspect-square w-full items-center justify-center bg-gradient-to-br from-neutral-100 to-neutral-300 text-center text-sm text-black/45">
      <div>
        <ImageIcon className="mx-auto mb-2 h-8 w-8" />
        {label}
      </div>
    </div>
  );
}

function InstagramPostPreview({ settings }: { settings: InstagramSettings }) {
  return (
    <div className="flex h-full flex-col bg-white text-black">
      <StatusBar time={settings.deviceTime} />
      <div className="flex h-12 items-center justify-between border-b border-black/10 px-4">
        <div className="text-[22px] font-bold tracking-tight">Instagram</div>
        <div className="flex items-center gap-4"><Heart className="h-6 w-6" /><MessageCircle className="h-6 w-6" /></div>
      </div>
      <div className="flex-1 overflow-y-auto bg-white">
        <div className="flex items-center justify-between px-3 py-3">
          <div className="flex items-center gap-3">
            <Avatar label={settings.avatarLabel} image={settings.avatarImage} />
            <div>
              <div className="text-sm font-semibold leading-tight">{settings.username}</div>
              <div className="text-xs text-black/55">{settings.displayName}</div>
            </div>
          </div>
          <MoreHorizontal className="h-5 w-5" />
        </div>
        {settings.postImage ? (
          <img src={settings.postImage} alt="post" className="aspect-square w-full object-cover" />
        ) : (
          <EmptyImage label="投稿画像を設定できます" />
        )}
        <div className="space-y-2 px-3 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4"><Heart className="h-6 w-6" /><MessageCircle className="h-6 w-6" /><Send className="h-6 w-6" /></div>
            <Bookmark className="h-6 w-6" />
          </div>
          <div className="text-sm font-semibold">いいね！{settings.likeCount}件</div>
          <div className="text-sm leading-relaxed"><span className="font-semibold">{settings.username}</span> {settings.caption}</div>
          <div className="text-sm text-black/45">コメント{settings.commentCount}件をすべて見る</div>
          <div className="text-xs uppercase text-black/35">{settings.postTime}</div>
        </div>
      </div>
      <div className="flex h-12 items-center justify-around border-t border-black/10 bg-white text-black/80">
        <Home className="h-6 w-6" /><Search className="h-6 w-6" /><Plus className="h-6 w-6" /><MessageCircle className="h-6 w-6" /><Avatar label={settings.avatarLabel} image={settings.avatarImage} size="h-6 w-6" />
      </div>
    </div>
  );
}

function InstagramStoryPreview({ settings }: { settings: InstagramSettings }) {
  const storyStyle = settings.storyImage
    ? { backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,.18), rgba(0,0,0,.28)), url(${settings.storyImage})`, backgroundSize: "cover", backgroundPosition: "center" }
    : { background: "linear-gradient(135deg, #f97316, #db2777, #7c3aed)" };

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-black text-white" style={storyStyle}>
      <StatusBar time={settings.deviceTime} />
      <div className="px-3 pt-2">
        <div className="flex gap-1">
          <div className="h-0.5 flex-1 rounded-full bg-white" />
          <div className="h-0.5 flex-1 rounded-full bg-white/40" />
        </div>
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar label={settings.avatarLabel} image={settings.avatarImage} />
            <div className="text-sm font-semibold drop-shadow">{settings.username}</div>
            <div className="text-xs text-white/75">今</div>
          </div>
          <X className="h-5 w-5" />
        </div>
      </div>
      <div className="flex flex-1 items-center justify-center px-6 text-center">
        <div className="max-w-[86%] rounded-3xl bg-white/90 px-5 py-4 text-2xl font-bold leading-relaxed text-black shadow-2xl">
          {settings.storyText || "ストーリーテキスト"}
        </div>
      </div>
      <div className="flex items-center gap-3 px-4 pb-5">
        <div className="flex-1 rounded-full border border-white/80 bg-black/20 px-4 py-3 text-sm text-white/90 backdrop-blur">{settings.storyReplyPlaceholder}</div>
        <Heart className="h-7 w-7" />
        <Send className="h-7 w-7" />
      </div>
    </div>
  );
}

export default function InstagramMockCreator() {
  const router = useRouter();
  const [settings, setSettings] = useState<InstagramSettings>(defaultSettings);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<SettingsTab>("create");

  useEffect(() => {
    setSettings(readStoredSettings());
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // localStorage may be unavailable in private mode. The app still works for the current session.
    }
  }, [settings]);

  const update = <K extends keyof InstagramSettings>(key: K, value: InstagramSettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>, key: "avatarImage" | "postImage" | "storyImage") => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => update(key, String(reader.result) as InstagramSettings[typeof key]);
    reader.readAsDataURL(file);
    event.target.value = "";
  };

  const enterFullscreenIfNeeded = async (enabled: boolean) => {
    update("fullScreenMode", enabled);
    if (enabled && typeof document !== "undefined" && !document.fullscreenElement) {
      try { await document.documentElement.requestFullscreen(); } catch {}
    }
    if (!enabled && typeof document !== "undefined" && document.fullscreenElement) {
      try { await document.exitFullscreen(); } catch {}
    }
  };

  const screen = (
    <div className="h-full w-full overflow-hidden rounded-[inherit] bg-white">
      {settings.screenType === "post" ? <InstagramPostPreview settings={settings} /> : <InstagramStoryPreview settings={settings} />}
    </div>
  );

  const stage = settings.deviceFrameMode ? (
    <div className="flex min-h-[100dvh] items-center justify-center bg-black p-3">
      <div className="relative h-[min(92dvh,860px)] w-[min(94vw,430px)] overflow-hidden rounded-[38px] border-[10px] border-black bg-black shadow-2xl">
        {screen}
      </div>
    </div>
  ) : (
    <div className={cn("mx-auto h-[100dvh] w-full bg-white", settings.fullScreenMode ? "max-w-none" : "max-w-md")} style={{ backgroundColor: settings.bgColor }}>
      {screen}
    </div>
  );

  return (
    <div className="relative min-h-[100dvh] bg-[#f2f2f2]">
      {stage}

      {settings.showSettingsButton && (
        <button
          type="button"
          onClick={() => setSettingsOpen(true)}
          className="fixed bottom-[calc(env(safe-area-inset-bottom)+18px)] right-5 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-black/75 text-white shadow-xl backdrop-blur transition active:scale-95"
          aria-label="設定を開く"
        >
          <Settings2 className="h-5 w-5" />
        </button>
      )}

      {!settings.showSettingsButton && (
        <button type="button" onClick={() => setSettingsOpen(true)} className="fixed bottom-0 right-0 z-40 h-16 w-16 opacity-0" aria-label="隠し設定ボタン" />
      )}

      {settingsOpen && (
        <div className="fixed inset-0 z-50 bg-black/35">
          <div className="absolute inset-x-0 bottom-0 mx-auto flex h-[86vh] w-full max-w-md flex-col rounded-t-[28px] bg-[#fafafa] px-4 pt-4 shadow-2xl">
            <div className="mb-4 flex shrink-0 items-center justify-between gap-3">
              <button type="button" onClick={() => setSettingsOpen(false)} className="flex h-11 w-11 items-center justify-center rounded-full bg-black/[0.06]"><X className="h-5 w-5" /></button>
              <div className="text-sm font-semibold text-black/75">Instagram風 画面設定</div>
              <button type="button" onClick={() => router.push("/")} className="rounded-full bg-black/[0.06] px-3 py-2 text-xs font-medium text-black/65">チャットへ</button>
            </div>

            <div className="mb-4 grid shrink-0 grid-cols-3 rounded-3xl bg-black/[0.06] p-1">
              <TabButton active={activeTab === "create"} onClick={() => setActiveTab("create")}>作成</TabButton>
              <TabButton active={activeTab === "screen"} onClick={() => setActiveTab("screen")}>画面</TabButton>
              <TabButton active={activeTab === "modes"} onClick={() => setActiveTab("modes")}>モード</TabButton>
            </div>

            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto pb-[max(48px,env(safe-area-inset-bottom))]">
              {activeTab === "create" && (
                <div className="space-y-4">
                  <SectionCard icon={ImageIcon} title="作成する画面">
                    <div className="grid grid-cols-2 gap-2">
                      <Button onClick={() => update("screenType", "post")} variant={settings.screenType === "post" ? "default" : "outline"}>投稿画面</Button>
                      <Button onClick={() => update("screenType", "story")} variant={settings.screenType === "story" ? "default" : "outline"}>ストーリー</Button>
                    </div>
                  </SectionCard>

                  <SectionCard icon={UserCircle2} title="アカウント">
                    <div className="space-y-2"><Label>ユーザー名</Label><Input value={settings.username} onChange={(e) => update("username", e.target.value)} /></div>
                    <div className="space-y-2"><Label>表示名</Label><Input value={settings.displayName} onChange={(e) => update("displayName", e.target.value)} /></div>
                    <div className="space-y-2"><Label>アイコン文字</Label><Input value={settings.avatarLabel} onChange={(e) => update("avatarLabel", e.target.value.slice(0, 2))} /></div>
                    <div className="flex items-center gap-3"><FileButton accept="image/*" onFile={(e) => handleImageUpload(e, "avatarImage")}>アイコン画像</FileButton><Button variant="outline" onClick={() => update("avatarImage", null)}>解除</Button></div>
                  </SectionCard>

                  {settings.screenType === "post" ? (
                    <SectionCard icon={ImageIcon} title="投稿内容">
                      <div className="flex items-center gap-3"><FileButton accept="image/*" onFile={(e) => handleImageUpload(e, "postImage")}>投稿画像</FileButton><Button variant="outline" onClick={() => update("postImage", null)}>解除</Button></div>
                      <div className="space-y-2"><Label>キャプション</Label><Textarea value={settings.caption} onChange={(e) => update("caption", e.target.value)} /></div>
                      <div className="grid grid-cols-2 gap-3"><div className="space-y-2"><Label>いいね数</Label><Input value={settings.likeCount} onChange={(e) => update("likeCount", e.target.value)} /></div><div className="space-y-2"><Label>コメント数</Label><Input value={settings.commentCount} onChange={(e) => update("commentCount", e.target.value)} /></div></div>
                      <div className="space-y-2"><Label>投稿時刻</Label><Input value={settings.postTime} onChange={(e) => update("postTime", e.target.value)} /></div>
                    </SectionCard>
                  ) : (
                    <SectionCard icon={ImageIcon} title="ストーリー内容">
                      <div className="flex items-center gap-3"><FileButton accept="image/*" onFile={(e) => handleImageUpload(e, "storyImage")}>背景画像</FileButton><Button variant="outline" onClick={() => update("storyImage", null)}>解除</Button></div>
                      <div className="space-y-2"><Label>テキスト</Label><Textarea value={settings.storyText} onChange={(e) => update("storyText", e.target.value)} /></div>
                      <div className="space-y-2"><Label>返信欄</Label><Input value={settings.storyReplyPlaceholder} onChange={(e) => update("storyReplyPlaceholder", e.target.value)} /></div>
                    </SectionCard>
                  )}
                </div>
              )}

              {activeTab === "screen" && (
                <div className="space-y-4">
                  <SectionCard icon={Settings2} title="撮影表示">
                    <div className="flex items-center justify-between rounded-2xl border border-black/10 p-3"><div><div className="text-sm font-medium">フルスクリーンモード</div><div className="text-xs text-black/50">URLバーや余白を減らして撮影向きにします</div></div><Switch checked={settings.fullScreenMode} onCheckedChange={enterFullscreenIfNeeded} /></div>
                    <div className="flex items-center justify-between rounded-2xl border border-black/10 p-3"><div><div className="text-sm font-medium">デバイスフレーム</div><div className="text-xs text-black/50">黒フチのスマホ画面として表示</div></div><Switch checked={settings.deviceFrameMode} onCheckedChange={(v) => update("deviceFrameMode", v)} /></div>
                    <div className="flex items-center justify-between rounded-2xl border border-black/10 p-3"><div><div className="text-sm font-medium">設定ボタン表示</div><div className="text-xs text-black/50">撮影時はOFFにできます</div></div><Switch checked={settings.showSettingsButton} onCheckedChange={(v) => update("showSettingsButton", v)} /></div>
                    <div className="space-y-2"><Label>端末時刻</Label><Input value={settings.deviceTime} onChange={(e) => update("deviceTime", e.target.value)} /></div>
                    <div className="space-y-2"><Label>外側背景色</Label><Input type="color" value={settings.bgColor} onChange={(e) => update("bgColor", e.target.value)} className="h-12 p-1" /></div>
                  </SectionCard>

                  <SectionCard icon={Palette} title="初期化">
                    <Button variant="outline" className="w-full" onClick={() => setSettings(defaultSettings)}>Instagramモードを初期設定に戻す</Button>
                  </SectionCard>
                </div>
              )}

              {activeTab === "modes" && (
                <SectionCard icon={Settings2} title="モード切り替え">
                  <div className="grid grid-cols-1 gap-2">
                    <Button variant="outline" onClick={() => router.push("/")}>チャットモードへ</Button>
                    <Button variant="outline" onClick={() => router.push("/notification")}>通知画面モードへ</Button>
                    <Button>Instagramモード</Button>
                    <Button variant="outline" disabled>Xモード（準備中）</Button>
                    <Button variant="outline" disabled>TikTokモード（準備中）</Button>
                  </div>
                </SectionCard>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
