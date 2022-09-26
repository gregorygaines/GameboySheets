const SCREEN_WIDTH = 160;
const SCREEN_HEIGHT = 144;
const PIXEL_SIZE = 4;

const onOpen = (e) => {
  // Not the owner can't play
  if (e.user === "gainesagregory@gmail.com") {
    openInstructionSheet();
  } else {
    openGameboyScreenSheet();

    const sheet = SpreadsheetApp.getActiveSheet();
    const maxCols = sheet.getMaxColumns();
    const maxRows = sheet.getMaxRows();

    // Resize grid
    resizeSheetToGameboyDims(sheet, maxRows, maxCols);

    // Set the size of rows and cols to a pixel
    setSheetRowAndColsToSizeOfPixel(sheet, maxRows, maxCols);

    // Clear sheet
    clearSheet(sheet);

    // Add dialog menu action
    SpreadsheetApp
      .getUi()
      .createMenu("Gameboy Emulator")
      .addItem("Show Dialog", "showDialog")
      .addToUi();

    // Open dialog automatically
    createSpreadsheetOpenTrigger();
  }
}

const createSpreadsheetOpenTrigger = () => {
  var ss = SpreadsheetApp.getActive();
  ScriptApp.newTrigger('showDialog')
    .forSpreadsheet(ss)
    .onOpen()
    .create();
};

const showDialog = () => {
  const widget = HtmlService.createTemplateFromFile("dialog.html").evaluate();
  widget.setTitle("Gameboy Sheets");
  SpreadsheetApp.getUi().showSidebar(widget);
};

const resizeSheetToGameboyDims = (sheet, maxRows, maxCols) => {
  if (maxCols < SCREEN_WIDTH) {
    sheet.insertColumns(maxCols, SCREEN_WIDTH - maxCols);
  } else if (maxCols > SCREEN_WIDTH) {
    sheet.deleteColumns(SCREEN_WIDTH, maxCols - SCREEN_WIDTH);
  }

  if (maxRows < SCREEN_HEIGHT) {
    sheet.insertRows(maxRows, SCREEN_HEIGHT - maxRows);
  } else if (maxRows > SCREEN_HEIGHT) {
    sheet.deleteRows(SCREEN_HEIGHT, maxRows - SCREEN_HEIGHT);
  }
}

const setSheetRowAndColsToSizeOfPixel = (sheet, maxRows, maxCols) => {
  sheet.setRowHeights(1, maxRows, PIXEL_SIZE);
  sheet.setColumnWidths(1, maxCols, PIXEL_SIZE);
}

const clearSheet = (sheet) => {
  const range = sheet.getRange("1:144");
  range.setBackground("#ffffff");
}

const openGameboyScreenSheet = () => {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  spreadsheet.setActiveSheet(spreadsheet.getSheets()[1]);
}

const openInstructionSheet = () => {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  spreadsheet.setActiveSheet(spreadsheet.getSheets()[0]);
}

// Client side functions

const include = filename => {
  return HtmlService.createHtmlOutputFromFile(filename)
    .getContent();
};

const drawGrid = (colors) => {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheets()[1];
    const range = sheet.getRange("1:144");
    range.setBackgrounds(colors);
    SpreadsheetApp.flush();
  } catch (e) {
    Logger.log(e);
  }
}
