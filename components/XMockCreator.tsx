"use client";

import React, { ChangeEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  BarChart3,
  Bell,
  Bookmark,
  Check,
  Heart,
  Image as ImageIcon,
  MessageCircle,
  MoreHorizontal,
  Palette,
  Repeat2,
  Search,
  Send,
  Settings2,
  Trash2,
  Upload,
  UserCircle2,
  X as XIcon,
} from "lucide-react";

type XScreenType = "detail" | "timeline" | "notifications";
type XThemeKey = "light" | "dark" | "blue" | "red" | "purple" | "soft";
type SettingsTab = "create" | "replies" | "saved" | "screen" | "modes";

type ReplyItem = {
  id: string;
  username: string;
  displayName: string;
  avatarLabel: string;
  avatarImage: string | null;
  text: string;
  time: string;
  liked: boolean;
  likeCount: number;
};

type SavedPreset = {
  id: string;
  name: string;
  savedAt: string;
  settings: XSettings;
};

type XSettings = {
  screenType: XScreenType;
  themeKey: XThemeKey;
  appName: string;
  displayName: string;
  username: string;
  verified: boolean;
  avatarLabel: string;
  avatarImage: string | null;
  postText: string;
  postTime: string;
  postDate: string;
  postImages: string[];
  currentImageIndex: number;
  replyCount: number;
  repostCount: number;
  quoteCount: number;
  likeCount: number;
  viewCount: string;
  liked: boolean;
  reposted: boolean;
  bookmarked: boolean;
  replyUserName: string;
  replyDisplayName: string;
  replyAvatarLabel: string;
  replyAvatarImage: string | null;
  replyInput: string;
  replies: ReplyItem[];
  notificationTitle: string;
  notificationText: string;
  deviceTime: string;
  showStatusBar: boolean;
  fullScreenMode: boolean;
  deviceFrameMode: boolean;
  showSettingsButton: boolean;
  bgColor: string;
};

const STORAGE_KEY = "x-mock-settings-v1";
const SAVED_STORAGE_KEY = "x-mock-saved-presets-v1";

const initialSettings: XSettings = {
  screenType: "detail",
  themeKey: "light",
  appName: "Postly",
  displayName: "青井 映",
  username: "aoi_scene",
  verified: false,
  avatarLabel: "A",
  avatarImage: null,
  postText: "誰かの何気ない投稿が、人生を少しだけ変えることがある。\n\nこれは、映画の中の架空SNS画面です。",
  postTime: "21:12",
  postDate: "2026年4月18日",
  postImages: [],
  currentImageIndex: 0,
  replyCount: 12,
  repostCount: 48,
  quoteCount: 6,
  likeCount: 394,
  viewCount: "8,245",
  liked: false,
  reposted: false,
  bookmarked: false,
  replyUserName: "guest_user",
  replyDisplayName: "Guest",
  replyAvatarLabel: "G",
  replyAvatarImage: null,
  replyInput: "これ、続きが気になる。",
  replies: [
    { id: "r1", username: "ren_film", displayName: "Ren", avatarLabel: "R", avatarImage: null, text: "この一文だけで物語が始まりそう。", time: "3分", liked: false, likeCount: 4 },
    { id: "r2", username: "mika_story", displayName: "Mika", avatarLabel: "M", avatarImage: null, text: "撮影用ならかなり自然に見えるね。", time: "12分", liked: false, likeCount: 9 },
  ],
  notificationTitle: "新しい通知",
  notificationText: "あなたの投稿に新しい返信がありました",
  deviceTime: "21:12",
  showStatusBar: true,
  fullScreenMode: false,
  deviceFrameMode: true,
  showSettingsButton: true,
  bgColor: "#e5e7eb",
};

const themes: Record<XThemeKey, {
  label: string;
  page: string;
  phone: string;
  panel: string;
  text: string;
  sub: string;
  border: string;
  button: string;
  accent: string;
  soft: string;
  input: string;
}> = {
  light: {
    label: "X風ライト",
    page: "bg-slate-100",
    phone: "bg-white",
    panel: "bg-white",
    text: "text-slate-950",
    sub: "text-slate-500",
    border: "border-slate-200",
    button: "bg-slate-950 text-white",
    accent: "text-sky-500",
    soft: "bg-slate-50",
    input: "bg-white border-slate-200 text-slate-950 placeholder:text-slate-400",
  },
  dark: {
    label: "ダークモード",
    page: "bg-zinc-950",
    phone: "bg-black",
    panel: "bg-black",
    text: "text-zinc-50",
    sub: "text-zinc-500",
    border: "border-zinc-800",
    button: "bg-zinc-50 text-zinc-950",
    accent: "text-sky-400",
    soft: "bg-zinc-900",
    input: "bg-zinc-950 border-zinc-800 text-zinc-50 placeholder:text-zinc-500",
  },
  blue: {
    label: "青ベース",
    page: "bg-blue-50",
    phone: "bg-white",
    panel: "bg-white",
    text: "text-slate-950",
    sub: "text-slate-500",
    border: "border-blue-100",
    button: "bg-blue-500 text-white",
    accent: "text-blue-500",
    soft: "bg-blue-50",
    input: "bg-white border-blue-100 text-slate-950 placeholder:text-slate-400",
  },
  red: {
    label: "赤ベース",
    page: "bg-red-50",
    phone: "bg-white",
    panel: "bg-white",
    text: "text-slate-950",
    sub: "text-slate-500",
    border: "border-red-100",
    button: "bg-red-500 text-white",
    accent: "text-red-500",
    soft: "bg-red-50",
    input: "bg-white border-red-100 text-slate-950 placeholder:text-slate-400",
  },
  purple: {
    label: "紫ベース",
    page: "bg-purple-50",
    phone: "bg-white",
    panel: "bg-white",
    text: "text-slate-950",
    sub: "text-slate-500",
    border: "border-purple-100",
    button: "bg-purple-500 text-white",
    accent: "text-purple-500",
    soft: "bg-purple-50",
    input: "bg-white border-purple-100 text-slate-950 placeholder:text-slate-400",
  },
  soft: {
    label: "ソフト",
    page: "bg-orange-50",
    phone: "bg-[#fffaf5]",
    panel: "bg-[#fffaf5]",
    text: "text-stone-950",
    sub: "text-stone-500",
    border: "border-stone-200",
    button: "bg-stone-900 text-white",
    accent: "text-orange-500",
    soft: "bg-orange-100/60",
    input: "bg-white border-stone-200 text-stone-950 placeholder:text-stone-400",
  },
};

function StatusCellDots({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 18 14" className={className} fill="currentColor" aria-hidden="true">
      <circle cx="3" cy="10.7" r="1.2" opacity="0.55" />
      <circle cx="7" cy="8.8" r="1.45" opacity="0.72" />
      <circle cx="11" cy="6.7" r="1.7" opacity="0.85" />
      <circle cx="15" cy="4.4" r="1.95" />
    </svg>
  );
}

function StatusWifi({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 14" className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2.3 5.2A12.2 12.2 0 0 1 10 2.5a12.2 12.2 0 0 1 7.7 2.7" strokeWidth="1.7" opacity="0.6" />
      <path d="M4.8 7.8A8.2 8.2 0 0 1 10 5.9a8.2 8.2 0 0 1 5.2 1.9" strokeWidth="1.7" opacity="0.82" />
      <path d="M7.4 10.2A4.4 4.4 0 0 1 10 9.3a4.4 4.4 0 0 1 2.6.9" strokeWidth="1.7" />
      <circle cx="10" cy="12" r="1.05" fill="currentColor" stroke="none" />
    </svg>
  );
}

function StatusBattery({ className = "", level = 100 }: { className?: string; level?: number }) {
  const safeLevel = Math.max(0, Math.min(100, level));
  const fillWidth = 16 * (safeLevel / 100);
  return (
    <svg viewBox="0 0 30 14" className={className} fill="none" aria-hidden="true">
      <rect x="1" y="1.5" width="24" height="11" rx="3" stroke="currentColor" strokeWidth="1.7" />
      <rect x="26.2" y="4.2" width="2.3" height="5.6" rx="1.1" fill="currentColor" />
      <rect x="3.2" y="3.6" width={fillWidth} height="6.8" rx="1.8" fill="currentColor" />
    </svg>
  );
}

function ChatStatusBar({ time, className = "" }: { time: string; className?: string }) {
  return (
    <div className={className}>
      <div className="flex items-center justify-between text-[12px] font-semibold tracking-[-0.01em] opacity-[0.98] [text-shadow:0_1px_1px_rgba(0,0,0,0.12)]">
        <span className="tabular-nums">{time}</span>
        <div className="flex items-center gap-1.5">
          <StatusCellDots className="h-[10px] w-[17px]" />
          <StatusWifi className="h-[10px] w-[16px]" />
          <StatusBattery className="h-[11px] w-[24px]" level={100} />
        </div>
      </div>
    </div>
  );
}

function cls(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function readImageFile(file: File, callback: (dataUrl: string) => void) {
  const reader = new FileReader();
  reader.onload = () => callback(typeof reader.result === "string" ? reader.result : "");
  reader.readAsDataURL(file);
}

function readImageFiles(files: FileList | null, callback: (dataUrls: string[]) => void) {
  if (!files || files.length === 0) return;
  const fileArray = Array.from(files);
  Promise.all(
    fileArray.map(
      (file) =>
        new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : "");
          reader.readAsDataURL(file);
        })
    )
  ).then((urls) => callback(urls.filter(Boolean)));
}

function Avatar({ image, label, size = "h-11 w-11", className = "" }: { image: string | null; label: string; size?: string; className?: string }) {
  return (
    <div className={cls(size, "flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 text-sm font-bold text-white", className)}>
      {image ? <img src={image} alt="" className="h-full w-full object-cover" /> : <span>{label || "U"}</span>}
    </div>
  );
}

function Button({ children, onClick, variant = "primary", className = "", disabled = false }: { children: React.ReactNode; onClick?: () => void; variant?: "primary" | "outline" | "ghost" | "danger"; className?: string; disabled?: boolean }) {
  const base = "inline-flex min-h-10 items-center justify-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-45";
  const styles = variant === "primary" ? "bg-black text-white hover:bg-black/85" : variant === "danger" ? "bg-red-500 text-white hover:bg-red-600" : variant === "ghost" ? "bg-transparent text-black hover:bg-black/5" : "border border-black/10 bg-white text-black hover:bg-black/5";
  return <button type="button" onClick={onClick} disabled={disabled} className={cls(base, styles, className)}>{children}</button>;
}

function Field({ label, value, onChange, placeholder, type = "text" }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string; type?: string }) {
  return (
    <label className="grid gap-1.5 text-sm font-semibold text-black/70">
      <span>{label}</span>
      <input value={value} type={type} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className="rounded-2xl border border-black/10 bg-white px-3 py-2.5 text-sm outline-none focus:ring-4 focus:ring-black/10" />
    </label>
  );
}

function TextArea({ label, value, onChange, rows = 4 }: { label: string; value: string; onChange: (value: string) => void; rows?: number }) {
  return (
    <label className="grid gap-1.5 text-sm font-semibold text-black/70">
      <span>{label}</span>
      <textarea value={value} rows={rows} onChange={(e) => onChange(e.target.value)} className="rounded-2xl border border-black/10 bg-white px-3 py-2.5 text-sm outline-none focus:ring-4 focus:ring-black/10" />
    </label>
  );
}

function SectionCard({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl border border-black/10 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2 text-sm font-bold text-black/75"><Icon className="h-4 w-4" />{title}</div>
      <div className="grid gap-3">{children}</div>
    </section>
  );
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return <button type="button" onClick={onClick} className={cls("rounded-full px-3 py-2 text-xs font-bold transition", active ? "bg-black text-white" : "bg-white text-black/60 hover:bg-black/5")}>{children}</button>;
}

function Switch({ checked, onChange }: { checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <button type="button" onClick={() => onChange(!checked)} className={cls("relative h-7 w-12 rounded-full transition", checked ? "bg-black" : "bg-black/15")}>
      <span className={cls("absolute top-1 h-5 w-5 rounded-full bg-white transition", checked ? "left-6" : "left-1")} />
    </button>
  );
}

function ActionStat({ icon: Icon, value, active, activeClass, onClick }: { icon: React.ElementType; value: string | number; active?: boolean; activeClass?: string; onClick?: () => void }) {
  return (
    <button type="button" onClick={onClick} className={cls("flex items-center gap-1.5 text-xs transition", active ? activeClass : "text-current opacity-70 hover:opacity-100")}>
      <Icon className={cls("h-[18px] w-[18px]", active ? "fill-current" : "")} />
      <span>{value}</span>
    </button>
  );
}

function ImageGrid({ images, currentImageIndex, setCurrentImageIndex }: { images: string[]; currentImageIndex: number; setCurrentImageIndex: (index: number) => void }) {
  if (images.length === 0) {
    return (
      <div className="mt-3 flex aspect-[4/3] items-center justify-center rounded-3xl border border-dashed border-current/20 bg-current/5 text-xs opacity-55">
        画像なし / 撮影用の投稿画像をアップロード
      </div>
    );
  }

  const currentImage = images[Math.max(0, Math.min(currentImageIndex, images.length - 1))];
  return (
    <div className="relative mt-3 overflow-hidden rounded-3xl border border-current/10 bg-black">
      <img src={currentImage} alt="投稿画像" className="aspect-[4/3] w-full object-cover" />
      {images.length > 1 && (
        <>
          <div className="absolute right-3 top-3 rounded-full bg-black/65 px-2 py-1 text-xs font-bold text-white">{currentImageIndex + 1}/{images.length}</div>
          <button type="button" onClick={() => setCurrentImageIndex(Math.max(0, currentImageIndex - 1))} className="absolute left-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-black/45 text-white">‹</button>
          <button type="button" onClick={() => setCurrentImageIndex(Math.min(images.length - 1, currentImageIndex + 1))} className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-black/45 text-white">›</button>
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1">
            {images.map((_, index) => <span key={index} className={cls("h-1.5 rounded-full transition-all", index === currentImageIndex ? "w-4 bg-white" : "w-1.5 bg-white/50")} />)}
          </div>
        </>
      )}
    </div>
  );
}

export default function XMockCreator() {
  const router = useRouter();
  const [settings, setSettings] = useState<XSettings>(initialSettings);
  const [activeTab, setActiveTab] = useState<SettingsTab>("create");
  const [settingsOpen, setSettingsOpen] = useState(true);
  const [replyPanelOpen, setReplyPanelOpen] = useState(false);
  const [presetName, setPresetName] = useState("X投稿_01");
  const [savedPresets, setSavedPresets] = useState<SavedPreset[]>([]);

  const theme = themes[settings.themeKey];
  const displayReplyCount = settings.replyCount + settings.replies.length;
  const displayLikeCount = settings.likeCount + (settings.liked ? 1 : 0);
  const displayRepostCount = settings.repostCount + (settings.reposted ? 1 : 0);

  const update = <K extends keyof XSettings>(key: K, value: XSettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setSettings({ ...initialSettings, ...JSON.parse(saved) });
      const presets = localStorage.getItem(SAVED_STORAGE_KEY);
      if (presets) setSavedPresets(JSON.parse(presets));
    } catch {
      // localStorageが使えない環境では初期値のまま表示
    }
  }, []);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(settings)); } catch {}
  }, [settings]);

  useEffect(() => {
    try { localStorage.setItem(SAVED_STORAGE_KEY, JSON.stringify(savedPresets)); } catch {}
  }, [savedPresets]);

  const addReply = () => {
    const text = settings.replyInput.trim();
    if (!text) return;
    const reply: ReplyItem = {
      id: String(Date.now()),
      username: settings.replyUserName || "guest_user",
      displayName: settings.replyDisplayName || "Guest",
      avatarLabel: settings.replyAvatarLabel || "G",
      avatarImage: settings.replyAvatarImage,
      text,
      time: "今",
      liked: false,
      likeCount: 0,
    };
    update("replies", [reply, ...settings.replies]);
    update("replyInput", "");
    setReplyPanelOpen(true);
  };

  const deleteReply = (id: string) => update("replies", settings.replies.filter((reply) => reply.id !== id));

  const toggleReplyLike = (id: string) => {
    update("replies", settings.replies.map((reply) => reply.id === id ? { ...reply, liked: !reply.liked, likeCount: reply.likeCount + (reply.liked ? -1 : 1) } : reply));
  };

  const savePreset = () => {
    const name = presetName.trim() || `X保存_${savedPresets.length + 1}`;
    const preset: SavedPreset = { id: String(Date.now()), name, savedAt: new Date().toLocaleString("ja-JP"), settings };
    setSavedPresets((prev) => [preset, ...prev]);
  };

  const overwritePreset = (id: string) => {
    setSavedPresets((prev) => prev.map((preset) => preset.id === id ? { ...preset, settings, savedAt: new Date().toLocaleString("ja-JP") } : preset));
  };

  const duplicatePreset = (preset: SavedPreset) => {
    setSavedPresets((prev) => [{ ...preset, id: String(Date.now()), name: `${preset.name}_コピー`, savedAt: new Date().toLocaleString("ja-JP") }, ...prev]);
  };

  const removePreset = (id: string) => setSavedPresets((prev) => prev.filter((preset) => preset.id !== id));

  const header = (
    <>
      {settings.showStatusBar && <ChatStatusBar time={settings.deviceTime} className="px-5 pb-2 pt-3" />}
      <div className={cls("flex items-center justify-between border-b px-4 py-3", theme.border)}>
        <div className="flex items-center gap-3">
          <ArrowLeft className="h-5 w-5" />
          <div>
            <div className="text-[15px] font-black leading-none">{settings.screenType === "timeline" ? settings.appName : settings.screenType === "notifications" ? "通知" : "ポスト"}</div>
            <div className={cls("mt-1 text-[11px]", theme.sub)}>{settings.appName}</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Search className="h-5 w-5" />
          <MoreHorizontal className="h-5 w-5" />
        </div>
      </div>
    </>
  );

  const postBlock = (compact = false) => (
    <article className={cls("border-b px-4 py-4", theme.border)}>
      <div className="flex items-start gap-3">
        <Avatar image={settings.avatarImage} label={settings.avatarLabel} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1">
            <span className="truncate text-[15px] font-black">{settings.displayName}</span>
            {settings.verified && <span className="grid h-4 w-4 place-items-center rounded-full bg-sky-500 text-white"><Check className="h-3 w-3" /></span>}
            <span className={cls("truncate text-sm", theme.sub)}>@{settings.username}</span>
            <span className={cls("text-sm", theme.sub)}>· {settings.postTime}</span>
          </div>
          <div className="mt-1 whitespace-pre-wrap text-[15px] leading-relaxed">{settings.postText}</div>
          <ImageGrid images={settings.postImages} currentImageIndex={settings.currentImageIndex} setCurrentImageIndex={(index) => update("currentImageIndex", index)} />
          {!compact && (
            <div className={cls("mt-3 flex items-center gap-1 border-b pb-3 text-xs", theme.border, theme.sub)}>
              <span>{settings.postTime}</span><span>·</span><span>{settings.postDate}</span><span>·</span><span className={theme.text}>{settings.viewCount}</span><span>件の表示</span>
            </div>
          )}
          <div className="mt-3 flex items-center justify-between">
            <ActionStat icon={MessageCircle} value={displayReplyCount} onClick={() => setReplyPanelOpen((prev) => !prev)} />
            <ActionStat icon={Repeat2} value={displayRepostCount} active={settings.reposted} activeClass="text-green-500" onClick={() => update("reposted", !settings.reposted)} />
            <ActionStat icon={Heart} value={displayLikeCount} active={settings.liked} activeClass="text-pink-500" onClick={() => update("liked", !settings.liked)} />
            <ActionStat icon={BarChart3} value={settings.viewCount} />
            <button type="button" onClick={() => update("bookmarked", !settings.bookmarked)} className={cls("transition", settings.bookmarked ? "text-sky-500" : "opacity-70 hover:opacity-100")}><Bookmark className={cls("h-[18px] w-[18px]", settings.bookmarked ? "fill-current" : "")} /></button>
          </div>
        </div>
      </div>
    </article>
  );

  const replyComposer = (
    <div className={cls("border-b px-4 py-3", theme.border)}>
      <div className="flex gap-3">
        <Avatar image={settings.replyAvatarImage} label={settings.replyAvatarLabel} size="h-9 w-9" />
        <div className="flex-1">
          <input value={settings.replyInput} onChange={(e) => update("replyInput", e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") addReply(); }} placeholder="返信をポスト" className={cls("w-full rounded-full border px-4 py-2 text-sm outline-none", theme.input)} />
          <div className="mt-2 flex justify-end"><button type="button" onClick={addReply} className={cls("rounded-full px-4 py-1.5 text-xs font-black", theme.button)}>返信</button></div>
        </div>
      </div>
    </div>
  );

  const repliesBlock = (
    <div>
      {replyPanelOpen && replyComposer}
      {settings.replies.map((reply) => (
        <article key={reply.id} className={cls("border-b px-4 py-3", theme.border)}>
          <div className="flex gap-3">
            <Avatar image={reply.avatarImage} label={reply.avatarLabel} size="h-9 w-9" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1">
                <span className="truncate text-sm font-black">{reply.displayName}</span>
                <span className={cls("truncate text-xs", theme.sub)}>@{reply.username}</span>
                <span className={cls("text-xs", theme.sub)}>· {reply.time}</span>
                <button type="button" onClick={() => deleteReply(reply.id)} className="ml-auto opacity-50 hover:text-red-500 hover:opacity-100"><Trash2 className="h-4 w-4" /></button>
              </div>
              <div className="mt-1 whitespace-pre-wrap text-sm leading-relaxed">{reply.text}</div>
              <div className="mt-2 flex items-center gap-8 text-xs">
                <button type="button" className={cls(theme.sub, "flex items-center gap-1")}><MessageCircle className="h-4 w-4" />0</button>
                <button type="button" className={cls(theme.sub, "flex items-center gap-1")}><Repeat2 className="h-4 w-4" />0</button>
                <button type="button" onClick={() => toggleReplyLike(reply.id)} className={cls("flex items-center gap-1", reply.liked ? "text-pink-500" : theme.sub)}><Heart className={cls("h-4 w-4", reply.liked ? "fill-current" : "")} />{reply.likeCount}</button>
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  );

  const notificationsScreen = (
    <div className="px-4 py-4">
      <div className={cls("rounded-3xl border p-4", theme.border, theme.soft)}>
        <div className="mb-3 flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-sky-500 text-white"><Bell className="h-5 w-5" /></div>
          <div>
            <div className="text-sm font-black">{settings.notificationTitle}</div>
            <div className={cls("text-xs", theme.sub)}>@{settings.username} への通知</div>
          </div>
        </div>
        <p className="text-sm leading-relaxed">{settings.notificationText}</p>
      </div>
      <div className={cls("mt-4 rounded-3xl border p-4", theme.border)}>
        <div className="mb-2 text-sm font-black">最近のアクティビティ</div>
        <div className="space-y-3 text-sm">
          <div className="flex gap-3"><Heart className="h-5 w-5 text-pink-500" /><span><b>{settings.displayName}</b> のポストにいいねが付きました</span></div>
          <div className="flex gap-3"><Repeat2 className="h-5 w-5 text-green-500" /><span>投稿がリポストされました</span></div>
          <div className="flex gap-3"><MessageCircle className="h-5 w-5 text-sky-500" /><span>新しい返信があります</span></div>
        </div>
      </div>
    </div>
  );

  const phoneContent = (
    <div className={cls("relative h-full overflow-hidden", theme.phone, theme.text)}>
      {header}
      <div className="h-[calc(100%-86px)] overflow-y-auto pb-20">
        {settings.screenType === "notifications" ? notificationsScreen : (
          <>
            {settings.screenType === "timeline" && <div className={cls("border-b px-4 py-3 text-sm font-black", theme.border)}>おすすめ</div>}
            {postBlock(settings.screenType === "timeline")}
            {settings.screenType === "timeline" ? (
              <>
                <article className={cls("border-b px-4 py-4", theme.border)}>
                  <div className="flex gap-3">
                    <Avatar image={null} label="S" />
                    <div className="min-w-0 flex-1">
                      <div className="flex gap-1 text-sm"><b>sample user</b><span className={theme.sub}>@sample · 18分</span></div>
                      <p className="mt-1 text-sm">撮影用のタイムライン投稿。背景として自然に流せます。</p>
                      <div className={cls("mt-3 flex justify-between text-xs", theme.sub)}><span>12</span><span>24</span><span>85</span><span>1,902</span></div>
                    </div>
                  </div>
                </article>
                <article className={cls("border-b px-4 py-4", theme.border)}>
                  <div className="flex gap-3">
                    <Avatar image={null} label="N" />
                    <div className="min-w-0 flex-1">
                      <div className="flex gap-1 text-sm"><b>news mock</b><span className={theme.sub}>@news_mock · 31分</span></div>
                      <p className="mt-1 text-sm">これは架空SNSの画面です。実在サービス名を避けて撮影できます。</p>
                    </div>
                  </div>
                </article>
              </>
            ) : repliesBlock}
          </>
        )}
      </div>
      {settings.showSettingsButton && (
        <button type="button" onClick={() => setSettingsOpen(true)} className="absolute bottom-4 right-4 grid h-12 w-12 place-items-center rounded-full bg-black text-white shadow-lg"><Settings2 className="h-5 w-5" /></button>
      )}
    </div>
  );

  const phone = settings.fullScreenMode ? (
    <div className="h-screen w-full overflow-hidden">{phoneContent}</div>
  ) : (
    <div className={cls("mx-auto overflow-hidden", settings.deviceFrameMode ? "h-[760px] w-[380px] rounded-[42px] border-[10px] border-black shadow-2xl" : "h-[760px] w-[380px] rounded-[28px] border border-black/10 shadow-xl")}>{phoneContent}</div>
  );

  return (
    <main className={cls("min-h-screen", theme.page)} style={{ backgroundColor: settings.bgColor || undefined }}>
      <div className={cls("grid min-h-screen gap-6 p-4", settings.fullScreenMode ? "grid-cols-1 p-0" : "lg:grid-cols-[420px_1fr]")}> 
        <section className={cls("flex items-start justify-center", settings.fullScreenMode ? "" : "lg:sticky lg:top-4")}>{phone}</section>

        {!settings.fullScreenMode && settingsOpen && (
          <aside className="rounded-[32px] bg-white/85 p-4 shadow-xl backdrop-blur lg:max-h-[calc(100vh-32px)] lg:overflow-y-auto">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h1 className="text-xl font-black">Xモード</h1>
                <p className="text-sm text-black/55">架空SNSの投稿・返信・通知画面を作成</p>
              </div>
              <button type="button" onClick={() => setSettingsOpen(false)} className="grid h-10 w-10 place-items-center rounded-full bg-black/5"><XIcon className="h-5 w-5" /></button>
            </div>

            <div className="mb-4 flex flex-wrap gap-2">
              <TabButton active={activeTab === "create"} onClick={() => setActiveTab("create")}>作成</TabButton>
              <TabButton active={activeTab === "replies"} onClick={() => setActiveTab("replies")}>返信</TabButton>
              <TabButton active={activeTab === "saved"} onClick={() => setActiveTab("saved")}>保存</TabButton>
              <TabButton active={activeTab === "screen"} onClick={() => setActiveTab("screen")}>画面</TabButton>
              <TabButton active={activeTab === "modes"} onClick={() => setActiveTab("modes")}>モード</TabButton>
            </div>

            <div className="grid gap-4">
              {activeTab === "create" && (
                <>
                  <SectionCard icon={Palette} title="表示タイプ / テーマ">
                    <div className="grid grid-cols-3 gap-2">
                      {(["detail", "timeline", "notifications"] as XScreenType[]).map((type) => <Button key={type} variant={settings.screenType === type ? "primary" : "outline"} onClick={() => update("screenType", type)} className="px-2">{type === "detail" ? "投稿詳細" : type === "timeline" ? "タイムライン" : "通知"}</Button>)}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {(Object.keys(themes) as XThemeKey[]).map((key) => <Button key={key} variant={settings.themeKey === key ? "primary" : "outline"} onClick={() => update("themeKey", key)}>{themes[key].label}</Button>)}
                    </div>
                    <Field label="アプリ名" value={settings.appName} onChange={(v) => update("appName", v)} />
                  </SectionCard>

                  <SectionCard icon={UserCircle2} title="投稿ユーザー">
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="表示名" value={settings.displayName} onChange={(v) => update("displayName", v)} />
                      <Field label="ユーザー名" value={settings.username} onChange={(v) => update("username", v)} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="アイコン文字" value={settings.avatarLabel} onChange={(v) => update("avatarLabel", v.slice(0, 2))} />
                      <label className="grid gap-1.5 text-sm font-semibold text-black/70"><span>アイコン画像</span><input type="file" accept="image/*" onChange={(e: ChangeEvent<HTMLInputElement>) => e.target.files?.[0] && readImageFile(e.target.files[0], (url) => update("avatarImage", url))} className="text-xs" /></label>
                    </div>
                    <div className="flex items-center justify-between rounded-2xl border border-black/10 p-3"><div><div className="text-sm font-bold">認証バッジ</div><div className="text-xs text-black/50">青いチェックを表示</div></div><Switch checked={settings.verified} onChange={(v) => update("verified", v)} /></div>
                  </SectionCard>

                  <SectionCard icon={MessageCircle} title="投稿内容">
                    <TextArea label="本文" value={settings.postText} onChange={(v) => update("postText", v)} rows={5} />
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="投稿時刻" value={settings.postTime} onChange={(v) => update("postTime", v)} />
                      <Field label="投稿日" value={settings.postDate} onChange={(v) => update("postDate", v)} />
                    </div>
                    <label className="grid gap-1.5 text-sm font-semibold text-black/70"><span>投稿画像（複数可）</span><input type="file" accept="image/*" multiple onChange={(e) => readImageFiles(e.target.files, (urls) => { update("postImages", [...settings.postImages, ...urls]); update("currentImageIndex", 0); })} className="text-xs" /></label>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" onClick={() => update("postImages", [])}><Trash2 className="h-4 w-4" />画像を全削除</Button>
                      <Button variant="outline" onClick={() => update("currentImageIndex", 0)}><ImageIcon className="h-4 w-4" />1枚目へ</Button>
                    </div>
                  </SectionCard>

                  <SectionCard icon={BarChart3} title="数値 / 操作状態">
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="返信数" type="number" value={String(settings.replyCount)} onChange={(v) => update("replyCount", Number(v) || 0)} />
                      <Field label="リポスト数" type="number" value={String(settings.repostCount)} onChange={(v) => update("repostCount", Number(v) || 0)} />
                      <Field label="引用数" type="number" value={String(settings.quoteCount)} onChange={(v) => update("quoteCount", Number(v) || 0)} />
                      <Field label="いいね数" type="number" value={String(settings.likeCount)} onChange={(v) => update("likeCount", Number(v) || 0)} />
                      <Field label="表示数" value={settings.viewCount} onChange={(v) => update("viewCount", v)} />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <Button variant={settings.liked ? "primary" : "outline"} onClick={() => update("liked", !settings.liked)}>いいね</Button>
                      <Button variant={settings.reposted ? "primary" : "outline"} onClick={() => update("reposted", !settings.reposted)}>リポスト</Button>
                      <Button variant={settings.bookmarked ? "primary" : "outline"} onClick={() => update("bookmarked", !settings.bookmarked)}>保存</Button>
                    </div>
                  </SectionCard>
                </>
              )}

              {activeTab === "replies" && (
                <>
                  <SectionCard icon={Send} title="返信するユーザー">
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="表示名" value={settings.replyDisplayName} onChange={(v) => update("replyDisplayName", v)} />
                      <Field label="ユーザー名" value={settings.replyUserName} onChange={(v) => update("replyUserName", v)} />
                      <Field label="アイコン文字" value={settings.replyAvatarLabel} onChange={(v) => update("replyAvatarLabel", v.slice(0, 2))} />
                      <label className="grid gap-1.5 text-sm font-semibold text-black/70"><span>アイコン画像</span><input type="file" accept="image/*" onChange={(e: ChangeEvent<HTMLInputElement>) => e.target.files?.[0] && readImageFile(e.target.files[0], (url) => update("replyAvatarImage", url))} className="text-xs" /></label>
                    </div>
                    <TextArea label="送信する返信" value={settings.replyInput} onChange={(v) => update("replyInput", v)} rows={3} />
                    <Button onClick={addReply}><Send className="h-4 w-4" />返信を送信</Button>
                  </SectionCard>

                  <SectionCard icon={MessageCircle} title="返信一覧">
                    {settings.replies.length === 0 ? <p className="text-sm text-black/50">返信はまだありません。</p> : settings.replies.map((reply) => (
                      <div key={reply.id} className="rounded-2xl border border-black/10 p-3">
                        <div className="mb-1 flex items-center gap-2 text-sm font-bold"><Avatar image={reply.avatarImage} label={reply.avatarLabel} size="h-7 w-7" />{reply.displayName}<span className="text-xs font-medium text-black/45">@{reply.username}</span></div>
                        <p className="text-sm text-black/75">{reply.text}</p>
                        <div className="mt-2 flex gap-2"><Button variant="outline" onClick={() => toggleReplyLike(reply.id)}>いいね切替</Button><Button variant="danger" onClick={() => deleteReply(reply.id)}>削除</Button></div>
                      </div>
                    ))}
                  </SectionCard>
                </>
              )}

              {activeTab === "saved" && (
                <SectionCard icon={Bookmark} title="保存">
                  <Field label="保存名" value={presetName} onChange={setPresetName} />
                  <Button onClick={savePreset}><Upload className="h-4 w-4" />現在のXモードを保存</Button>
                  <div className="grid gap-3">
                    {savedPresets.length === 0 ? <p className="text-sm text-black/50">保存データはまだありません。</p> : savedPresets.map((preset) => (
                      <div key={preset.id} className="rounded-2xl border border-black/10 p-3">
                        <div className="font-bold">{preset.name}</div>
                        <div className="mb-2 text-xs text-black/45">{preset.savedAt}</div>
                        <div className="grid grid-cols-2 gap-2">
                          <Button variant="outline" onClick={() => setSettings({ ...initialSettings, ...preset.settings })}>読み込み</Button>
                          <Button variant="outline" onClick={() => overwritePreset(preset.id)}>上書き</Button>
                          <Button variant="outline" onClick={() => duplicatePreset(preset)}>複製</Button>
                          <Button variant="danger" onClick={() => removePreset(preset.id)}>削除</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </SectionCard>
              )}

              {activeTab === "screen" && (
                <>
                  <SectionCard icon={Settings2} title="撮影表示">
                    <Field label="ステータスバー時刻" value={settings.deviceTime} onChange={(v) => update("deviceTime", v)} />
                    <Field label="背景色" value={settings.bgColor} onChange={(v) => update("bgColor", v)} />
                    <div className="flex items-center justify-between rounded-2xl border border-black/10 p-3"><div><div className="text-sm font-bold">ステータスバー表示</div><div className="text-xs text-black/50">チャットモードと同じアイコン</div></div><Switch checked={settings.showStatusBar} onChange={(v) => update("showStatusBar", v)} /></div>
                    <div className="flex items-center justify-between rounded-2xl border border-black/10 p-3"><div><div className="text-sm font-bold">端末フレーム</div><div className="text-xs text-black/50">黒いスマホ枠を表示</div></div><Switch checked={settings.deviceFrameMode} onChange={(v) => update("deviceFrameMode", v)} /></div>
                    <div className="flex items-center justify-between rounded-2xl border border-black/10 p-3"><div><div className="text-sm font-bold">設定ボタン表示</div><div className="text-xs text-black/50">撮影時に非表示推奨</div></div><Switch checked={settings.showSettingsButton} onChange={(v) => update("showSettingsButton", v)} /></div>
                    <div className="flex items-center justify-between rounded-2xl border border-black/10 p-3"><div><div className="text-sm font-bold">フルスクリーン</div><div className="text-xs text-black/50">スマホ枠と設定画面を外す</div></div><Switch checked={settings.fullScreenMode} onChange={(v) => update("fullScreenMode", v)} /></div>
                  </SectionCard>
                </>
              )}

              {activeTab === "modes" && (
                <SectionCard icon={Settings2} title="モード切り替え">
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" onClick={() => router.push("/")}>チャットモードへ</Button>
                    <Button variant="outline" onClick={() => router.push("/notification")}>通知画面モードへ</Button>
                    <Button variant="outline" onClick={() => router.push("/instagram")}>Instagramモードへ</Button>
                    <Button>Xモード</Button>
                    <Button disabled variant="outline">TikTokモード（準備中）</Button>
                  </div>
                </SectionCard>
              )}
            </div>
          </aside>
        )}
      </div>
    </main>
  );
}
