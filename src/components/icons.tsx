"use client";

// Talby icon set — Lucide (lucide-react). Thin, stroke-based outline icons that
// match the app's calm, uncluttered design language. (Earlier: @icon-park, then
// @fluentui/react-icons.) Each alias below keeps the same semantic name
// (IconHome, IconPlus, ...) so every call site is unchanged, but the glyphs are
// now Lucide.
//
// Lucide icons render as native SVG strokes (stroke-width ~2), so no forced
// outline/fill hacks are needed. The `size` prop maps to width/height; all
// className/style/data-* props pass straight through.

import type { ComponentType, SVGProps } from "react";
import {
  House,
  BriefcaseBusiness,
  Calendar,
  CircleDollarSign,
  DollarSign,
  Lightbulb,
  NotebookPen,
  PlugZap,
  Settings,
  Plus,
  X,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  Check,
  Ellipsis,
  Pencil,
  Trash2,
  Link,
  Eye,
  EyeOff,
  Search,
  Star,
  WandSparkles,
  ArrowUpFromLine,
  ArrowDownToLine,
  Paperclip,
  ShoppingBag,
  TrendingUp,
  Mail,
  Wallet,
  CreditCard,
  Gift,
  Send,
  Grid3x3,
  List,
  Funnel,
  RefreshCw,
  Bell,
  TriangleAlert,
  Info,
  CircleCheck,
  OctagonAlert,
  Menu,
  LogOut,
  User,
  Crown,
  Lock,
  MoonStar,
  GripVertical,
  Music,
  Clapperboard,
  FileText,
  ArrowUpDown,
  Minus,
  Camera,
  Table2,
} from "lucide-react";

type AnyIcon = ComponentType<SVGProps<SVGSVGElement> | Record<string, unknown>>;

/** Adapter: maps `size` onto width/height (Lucide's native sizing) and keeps a
 * consistent, thin stroke across every Lucide icon so the whole set reads as one
 * calm line-weight. strokeWidth can be overridden per call site via `rest`. */
function l(LucideIcon: AnyIcon) {
  return function Fitted(props: SVGProps<SVGSVGElement> & { size?: number }) {
    const { size, strokeWidth, ...rest } = props;
    const dim = size ?? 20;
    return <LucideIcon width={dim} height={dim} strokeWidth={strokeWidth ?? 1.6} {...rest} />;
  };
}

export const IconHome = l(House);
export const IconBriefcase = l(BriefcaseBusiness);
export const IconCalendar = l(Calendar);
export const IconMoney = l(CircleDollarSign);
export const IconDollar = l(DollarSign);
export const IconIdea = l(Lightbulb);
export const IconNotes = l(NotebookPen);
export const IconPlug = l(PlugZap);
export const IconSettings = l(Settings);
export const IconPlus = l(Plus);
export const IconAdd = l(Plus);
export const IconMinus = l(Minus);
export const IconZoomIn = l(Plus);
export const IconZoomOut = l(Minus);
export const IconCamera = l(Camera);
export const IconImport = l(Table2);
export const IconClose = l(X);
export const IconCloseSmall = l(X);
export const IconRight = l(ChevronRight);
export const IconLeft = l(ChevronLeft);
export const IconDown = l(ChevronDown);
export const IconUp = l(ChevronUp);
export const IconArrowRight = l(ArrowRight);
export const IconArrowLeft = l(ArrowLeft);
export const IconArrowUp = l(ArrowUp);
export const IconArrowDown = l(ArrowDown);
export const IconCheck = l(Check);
export const IconCheckSmall = l(Check);
export const IconCorrect = l(Check);
export const IconMore = l(Ellipsis);
export const IconEdit = l(Pencil);
export const IconDelete = l(Trash2);
export const IconLink = l(Link);
export const IconEye = l(Eye);
export const IconEyeInvisible = l(EyeOff);
export const IconSearch = l(Search);
export const IconStar = l(Star);
export const IconAuto = l(WandSparkles);
export const IconUpload = l(ArrowUpFromLine);
export const IconDownload = l(ArrowDownToLine);
export const IconPaperclip = l(Paperclip);
export const IconShopping = l(ShoppingBag);
export const IconTrend = l(TrendingUp);
export const IconMail = l(Mail);
export const IconWallet = l(Wallet);
export const IconCredit = l(CreditCard);
export const IconGift = l(Gift);
export const IconSend = l(Send);
export const IconGrid = l(Grid3x3);
export const IconList = l(List);
export const IconFilter = l(Funnel);
export const IconRefresh = l(RefreshCw);
export const IconRemind = l(Bell);
export const IconWarning = l(TriangleAlert);
export const IconInfo = l(Info);
export const IconSuccess = l(CircleCheck);
export const IconError = l(OctagonAlert);
export const IconMenu = l(Menu);
export const IconLogout = l(LogOut);
export const IconUser = l(User);
export const IconCrown = l(Crown);
export const IconLock = l(Lock);
export const IconPalette = l(MoonStar);
export const IconDrag = l(GripVertical);
export const IconMusic = l(Music);
export const IconVideo = l(Clapperboard);
export const IconFile = l(FileText);
export const IconSort = l(ArrowUpDown);