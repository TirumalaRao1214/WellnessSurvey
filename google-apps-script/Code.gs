/**
 * ================================================================
 * Lifestyle & Wellness Assessment — Google Apps Script Backend
 * File: Code.gs
 *
 * Deploy as Web App:
 *   Execute as: Me
 *   Who has access: Anyone
 *
 * Sheet columns (in order):
 *   Timestamp | ResponseID | Language | Date | Name | Age | Gender
 *   Contact | SurveyDoneBy | Q1 | Q2 | Q3 | Q4 | Q5 | Q5Other | Q6 | Q7 | Q8
 *   Q9 | Q9Other | Q10 | GuidanceRequested | PreferredMode
 *   PreferredTime | OverallScore | ActivityScore | DietScore
 *   HydrationScore | SleepScore | EnergyScore
 *   FocusArea1 | FocusArea2 | FocusArea3 | SubmissionStatus
 * ================================================================
 */

// ── Configuration ─────────────────────────────────────────────
const SPREADSHEET_ID = '1q8_-qP26wqfVNccyIfU94LJr-7VWW4vP6cSJozI6uUY'; // Your Google Sheet ID
const SHEET_NAME     = 'Responses';      // Tab name inside the sheet
const ID_PREFIX      = 'WL';            // Response ID prefix
const PROP_KEY       = 'dailyCounter';  // Script property for today's counter

// ── CORS Preflight (OPTIONS) ──────────────────────────────────
function doOptions() {
  return ContentService
    .createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT)
    .setHeaders({
      'Access-Control-Allow-Origin':  '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age':       '86400'
    });
}

// ── Main POST Handler ─────────────────────────────────────────
function doPost(e) {
  const headers = {
    'Access-Control-Allow-Origin':  '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };

  try {
    // ── Parse body ─────────────────────────────────────────
    // Note: browser sends Content-Type: text/plain (no-cors mode).
    // The body is still valid JSON — just parse it directly.
    let data;
    try {
      const raw = e.postData ? e.postData.contents : '{}';
      data = JSON.parse(raw);
    } catch (parseErr) {
      return jsonResponse({ success: false, error: 'Invalid JSON body' }, headers);
    }

    // ── Validate required fields ───────────────────────────
    const required = ['name', 'contact', 'language'];
    for (const field of required) {
      if (!data[field] || String(data[field]).trim() === '') {
        return jsonResponse({ success: false, error: `Missing required field: ${field}` }, headers);
      }
    }

    // ── Generate unique Response ID ────────────────────────
    const responseId = generateResponseId();

    // ── Timestamp ─────────────────────────────────────────
    const timestamp = new Date();
    const timestampStr = Utilities.formatDate(
      timestamp,
      Session.getScriptTimeZone(),
      'yyyy-MM-dd HH:mm:ss'
    );

    // ── Build the row array (matches column order) ─────────
    const row = [
      timestampStr,                              // Timestamp
      responseId,                                // ResponseID
      data.language      || '',                  // Language (EN / TE)
      data.date          || '',                  // Date
      (data.name         || '').trim(),          // Name
      data.age           || '',                  // Age
      data.gender        || '',                  // Gender
      (data.contact      || '').trim(),          // Contact
      (data.surveyDoneBy || '').trim(),          // SurveyDoneBy
      data.q1            || '',                  // Q1
      data.q2            || '',                  // Q2
      data.q3            || '',                  // Q3
      data.q4            || '',                  // Q4
      data.q5            || '',                  // Q5 (comma-separated)
      data.q5Other       || '',                  // Q5 Other
      data.q6            || '',                  // Q6
      data.q7            || '',                  // Q7
      data.q8            || '',                  // Q8
      data.q9            || '',                  // Q9
      data.q9Other       || '',                  // Q9 Other
      data.q10           || '',                  // Q10
      data.guidanceRequested  || '',             // GuidanceRequested
      data.preferredMode || '',                  // PreferredMode
      data.preferredTime || '',                  // PreferredTime
      data.overallScore  !== undefined ? data.overallScore  : '', // OverallScore
      data.activityScore !== undefined ? data.activityScore : '', // ActivityScore
      data.dietScore     !== undefined ? data.dietScore     : '', // DietScore
      data.hydrationScore !== undefined ? data.hydrationScore : '',// HydrationScore
      data.sleepScore    !== undefined ? data.sleepScore    : '', // SleepScore
      data.energyScore   !== undefined ? data.energyScore   : '', // EnergyScore
      data.focusArea1    || '',                  // FocusArea1
      data.focusArea2    || '',                  // FocusArea2
      data.focusArea3    || '',                  // FocusArea3
      'Submitted'                                // SubmissionStatus
    ];

    // ── Write to Sheet ─────────────────────────────────────
    const ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME) || createSheet(ss);
    sheet.appendRow(row);

    // ── Success response ───────────────────────────────────
    return jsonResponse({
      success:    true,
      responseId: responseId,
      message:    'Survey submitted successfully'
    }, headers);

  } catch (err) {
    // Log for debugging (visible in Apps Script execution log)
    Logger.log('doPost error: ' + err.toString());
    return jsonResponse({
      success: false,
      error:   'Server error: ' + err.message
    }, headers);
  }
}

// ── Response ID Generator ──────────────────────────────────────
/**
 * Generates a unique ID like WL-20260913-0001
 * Uses LockService to prevent race conditions when multiple
 * submissions arrive simultaneously.
 */
function generateResponseId() {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000); // wait up to 10 seconds

  try {
    const today    = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyyMMdd');
    const props    = PropertiesService.getScriptProperties();
    const propKey  = PROP_KEY + '_' + today;

    let counter    = parseInt(props.getProperty(propKey) || '0', 10);
    counter += 1;
    props.setProperty(propKey, String(counter));

    const padded   = String(counter).padStart(4, '0');
    return `${ID_PREFIX}-${today}-${padded}`;

  } finally {
    lock.releaseLock();
  }
}

// ── Sheet Setup ────────────────────────────────────────────────
/**
 * Creates the Responses sheet with all column headers
 * if it doesn't already exist.
 */
function createSheet(ss) {
  const sheet = ss.insertSheet(SHEET_NAME);

  const headers = [
    'Timestamp', 'ResponseID', 'Language', 'Date', 'Name', 'Age',
    'Gender', 'Contact', 'SurveyDoneBy', 'Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q5Other',
    'Q6', 'Q7', 'Q8', 'Q9', 'Q9Other', 'Q10',
    'GuidanceRequested', 'PreferredMode', 'PreferredTime',
    'OverallScore', 'ActivityScore', 'DietScore', 'HydrationScore',
    'SleepScore', 'EnergyScore',
    'FocusArea1', 'FocusArea2', 'FocusArea3', 'SubmissionStatus'
  ];

  sheet.appendRow(headers);

  // Style header row
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setBackground('#1B5E20');
  headerRange.setFontColor('#FFFFFF');
  headerRange.setFontWeight('bold');
  headerRange.setFontSize(11);

  // Freeze header row
  sheet.setFrozenRows(1);

  // Auto-resize columns
  sheet.autoResizeColumns(1, headers.length);

  return sheet;
}

// ── JSON Response Helper ───────────────────────────────────────
function jsonResponse(obj, headers) {
  const output = ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);

  // Attach CORS headers
  if (headers) {
    Object.entries(headers).forEach(([k, v]) => output.setHeader(k, v));
  }

  return output;
}

// ── Health Check (GET) ─────────────────────────────────────────
/**
 * Simple GET handler — returns status JSON.
 * Useful for verifying the deployment is live.
 * Access: https://script.google.com/macros/s/YOUR_ID/exec
 */
function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({
      status:  'online',
      service: 'Lifestyle & Wellness Assessment API',
      version: '1.0.0'
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

// ── Manual Setup Helper ────────────────────────────────────────
/**
 * Run this function ONCE manually from the Apps Script editor
 * to initialise the sheet headers if the sheet already exists
 * but has no headers.
 */
function setupSheet() {
  const ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    createSheet(ss);
    Logger.log('Sheet created: ' + SHEET_NAME);
  } else {
    Logger.log('Sheet already exists: ' + SHEET_NAME);
  }
}




