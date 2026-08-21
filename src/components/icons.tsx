"use client";

// Talby icon set — now Fluent (Microsoft Fluent System Icons) via @fluentui/react-icons.
// The app historically used @icon-park/outline. Each alias below keeps its old
// semantic name (IconHome, IconPlus, ...) so every call site is unchanged, but the
// underlying glyphs are Fluent. All components accept the same `size` / `className`
// / `style` / `data-*` props the old icons did.
//
// `size` is translated to width/height because Fluent icons accept width/height,
// not `size`. className/style/data-* pass straight through (Fluent spreads them).

import type { ComponentType, SVGProps } from "react";
import {
  HomeRegular,
  BriefcaseRegular,
  CalendarRegular,
  MoneyRegular,
  LightbulbRegular,
  NotebookRegular,
  PlugConnectedRegular,
  SettingsRegular,
  AddRegular,
  DismissRegular,
  ChevronRightRegular,
  ChevronLeftRegular,
  ChevronDownRegular,
  ChevronUpRegular,
  ArrowRightRegular,
  ArrowLeftRegular,
  ArrowUpRegular,
  ArrowDownRegular,
  CheckmarkRegular,
  MoreHorizontalRegular,
  EditRegular,
  DeleteRegular,
  LinkRegular,
  EyeRegular,
  EyeOffRegular,
  SearchRegular,
  StarRegular,
  WandRegular,
  ArrowUploadRegular,
  ArrowDownloadRegular,
  AttachRegular,
  ShoppingBagRegular,
  TimelineRegular,
  MailRegular,
  WalletRegular,
  CreditCardPersonRegular,
  GiftRegular,
  SendRegular,
  GridRegular,
  ListRegular,
  FilterRegular,
  ArrowSyncRegular,
  ClockRegular,
  WarningRegular,
  InfoRegular,
  CheckmarkCircleRegular,
  ErrorCircleRegular,
  NavigationRegular,
  SignOutRegular,
  PersonRegular,
  CrownRegular,
  LockClosedRegular,
  ColorRegular,
  DragRegular,
  MusicNote1Regular,
  VideoRegular,
  DocumentRegular,
} from "@fluentui/react-icons";

type AnyIcon = ComponentType<SVGProps<SVGSVGElement> | Record<string, unknown>>;

/** Adapter: maps the old icon-park `size` prop onto Fluent sizing.
 * Fluent's factory hardcodes width/height to the intrinsic '1em', overriding any
 * width/height we pass. The icon IS set to width="1em", so the clean lever is
 * font-size: 1em resolves against it. `style.fontSize` therefore sizes the icon
 * reliably. className/style/data-* still pass through.
 */
function fit(Icon: AnyIcon) {
  return function Fitted(props: SVGProps<SVGSVGElement> & { size?: number }) {
    const { size, style, ...rest } = props;
    const dim = size ?? 24;
    return <Icon style={{ ...style, fontSize: dim }} {...rest} />;
  };
}

export const IconHome = fit(HomeRegular);
export const IconBriefcase = fit(BriefcaseRegular);
export const IconCalendar = fit(CalendarRegular);
export const IconMoney = fit(MoneyRegular);
export const IconDollar = fit(MoneyRegular);
export const IconIdea = fit(LightbulbRegular);
export const IconNotes = fit(NotebookRegular);
export const IconPlug = fit(PlugConnectedRegular);
export const IconSettings = fit(SettingsRegular);
export const IconPlus = fit(AddRegular);
export const IconAdd = fit(AddRegular);
export const IconClose = fit(DismissRegular);
export const IconCloseSmall = fit(DismissRegular);
export const IconRight = fit(ChevronRightRegular);
export const IconLeft = fit(ChevronLeftRegular);
export const IconDown = fit(ChevronDownRegular);
export const IconUp = fit(ChevronUpRegular);
export const IconArrowRight = fit(ArrowRightRegular);
export const IconArrowLeft = fit(ArrowLeftRegular);
export const IconArrowUp = fit(ArrowUpRegular);
export const IconArrowDown = fit(ArrowDownRegular);
export const IconCheck = fit(CheckmarkRegular);
export const IconCheckSmall = fit(CheckmarkRegular);
export const IconCorrect = fit(CheckmarkRegular);
export const IconMore = fit(MoreHorizontalRegular);
export const IconEdit = fit(EditRegular);
export const IconDelete = fit(DeleteRegular);
export const IconLink = fit(LinkRegular);
export const IconEye = fit(EyeRegular);
export const IconEyeInvisible = fit(EyeOffRegular);
export const IconSearch = fit(SearchRegular);
export const IconStar = fit(StarRegular);
export const IconAuto = fit(WandRegular);
export const IconUpload = fit(ArrowUploadRegular);
export const IconDownload = fit(ArrowDownloadRegular);
export const IconPaperclip = fit(AttachRegular);
export const IconShopping = fit(ShoppingBagRegular);
export const IconTrend = fit(TimelineRegular);
export const IconMail = fit(MailRegular);
export const IconWallet = fit(WalletRegular);
export const IconCredit = fit(CreditCardPersonRegular);
export const IconGift = fit(GiftRegular);
export const IconSend = fit(SendRegular);
export const IconGrid = fit(GridRegular);
export const IconList = fit(ListRegular);
export const IconFilter = fit(FilterRegular);
export const IconRefresh = fit(ArrowSyncRegular);
export const IconRemind = fit(ClockRegular);
export const IconWarning = fit(WarningRegular);
export const IconInfo = fit(InfoRegular);
export const IconSuccess = fit(CheckmarkCircleRegular);
export const IconError = fit(ErrorCircleRegular);
export const IconMenu = fit(NavigationRegular);
export const IconLogout = fit(SignOutRegular);
export const IconUser = fit(PersonRegular);
export const IconCrown = fit(CrownRegular);
export const IconLock = fit(LockClosedRegular);
export const IconPalette = fit(ColorRegular);
export const IconDrag = fit(DragRegular);
export const IconMusic = fit(MusicNote1Regular);
export const IconVideo = fit(VideoRegular);
export const IconFile = fit(DocumentRegular);