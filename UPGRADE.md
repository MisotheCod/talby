# Upgrading from the first talby-ui zip

This zip replaces the board files from the first zip. The boards look and click exactly the same; they now also take real data through props.

1. Delete `src/components/talby` and copy the new `src/components/talby` in its place. Do not merge file by file.
2. Keep your own `src/components/talby-app` (TalbyPage, routes). Pass the new props through TalbyPage: `data`, `account`, `onAction` (see DATA.md and ACTIONS.md).
3. Replace `tools/talby-parity.cjs` and add the new docs (DATA.md, ACTIONS.md).
4. If you already started `src/lib/talby/to-board.ts`, type each mapper with the type from `_data.ts` (for example `OverviewData`) and fix what tsc reports. The shapes are close to what you started.
5. Rebuild with `TALBY_PREVIEW=1`, run the parity tool with `--looks`. It must still be 115 of 115.
