/**
 * Toqa Adel Portfolio - QA Automation Simulator & Sandbox
 * Powers the interactive live test runner, REST API validator, and SQL data integrity checker.
 */

document.addEventListener('DOMContentLoaded', () => {
  initLabTabs();
  initBddRunner();
  initApiValidator();
  initSqlValidator();
});

/* ==========================================================================
   1. QA LAB TAB SWITCHING
   ========================================================================== */
function initLabTabs() {
  const tabButtons = document.querySelectorAll('.lab-tab-btn');
  const tabPanels = document.querySelectorAll('.lab-tab-panel');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');

      // Update button active state
      tabButtons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      // Show matching panel
      tabPanels.forEach(panel => {
        if (panel.id === `tab-${targetTab}`) {
          panel.classList.add('active');
        } else {
          panel.classList.remove('active');
        }
      });
    });
  });
}

/* ==========================================================================
   2. BDD & SELENIUM TEST RUNNER SIMULATION
   ========================================================================== */
function initBddRunner() {
  const scenarioSelect = document.getElementById('scenarioSelect');
  const featurePreview = document.getElementById('featurePreview');
  const btnRunSuite = document.getElementById('btnRunSuite');
  const btnClearConsole = document.getElementById('btnClearConsole');
  const terminalConsole = document.getElementById('terminalConsole');
  const runnerStatusBadge = document.getElementById('runnerStatusBadge');
  const runnerProgressFill = document.getElementById('runnerProgressFill');
  const metricPassed = document.getElementById('metricPassed');
  const metricTotal = document.getElementById('metricTotal');
  const metricDuration = document.getElementById('metricDuration');

  if (!btnRunSuite) return;

  // Pre-configured Test Suites
  const testSuites = {
    checkout: {
      featureTitle: "Feature: E-Commerce Checkout Flow (Selenium + Cucumber)",
      codeSnippet: `<span class="token-kwd">Feature:</span> Resilient E-Commerce Checkout Flow
  <span class="token-kwd">Scenario:</span> Verify order submission & stock lock (POM)
    <span class="token-kwd">Given</span> user is logged in with valid session
    <span class="token-kwd">When</span> user submits order with item id "SKU-984"
    <span class="token-kwd">And</span> payment token is verified via Stripe API
    <span class="token-kwd">Then</span> order status code should be 200 CREATED
    <span class="token-kwd">And</span> database inventory stock is decremented by 1`,
      steps: [
        { type: "init", text: "Initializing headless Chrome driver (Selenium 4.18, TestNG, Java 17)..." },
        { type: "step", kwd: "GIVEN", text: "user logged in on CheckoutPage (POM) ...", time: "18ms" },
        { type: "step", kwd: "WHEN", text: "user submits payload to /api/v1/orders ...", time: "42ms" },
        { type: "step", kwd: "AND", text: "Stripe API webhook 200 token confirmation verified ...", time: "86ms" },
        { type: "step", kwd: "THEN", text: "assert status_code == 200 (schema validated) ...", time: "14ms" },
        { type: "step", kwd: "AND", text: "assert db.inventory.get('SKU-984').quantity == initial - 1 ...", time: "22ms" },
        { type: "summary", text: "✔ 4/4 scenarios passed (0 failures, 0 flaky) in 1.48s — RELEASE GATE GREEN" }
      ],
      totalPassed: 4
    },
    auth: {
      featureTitle: "Feature: Trello REST API Automation (RestAssured & Java)",
      codeSnippet: `<span class="token-kwd">Feature:</span> Trello Board & Card Lifecycle (RestAssured)
  <span class="token-kwd">Scenario:</span> Create Board, List, and Card with dynamic tokens
    <span class="token-kwd">Given</span> authorized API client with OAuth apiKey and token
    <span class="token-kwd">When</span> POST /1/boards/ creates board "QA Sprint Automation"
    <span class="token-kwd">And</span> POST /1/cards/ adds card to list with due date
    <span class="token-kwd">Then</span> status code is 200 OK and JSON schema is valid`,
      steps: [
        { type: "init", text: "Executing RestAssured test suite with Maven & TestNG against Trello API..." },
        { type: "step", kwd: "GIVEN", text: "requestSpecification configured with query params & headers ...", time: "19ms" },
        { type: "step", kwd: "WHEN", text: "POST /1/boards/ status == 200 (boardId captured) ...", time: "48ms" },
        { type: "step", kwd: "AND", text: "POST /1/cards/ with boardId (Hamcrest assertions passed) ...", time: "34ms" },
        { type: "step", kwd: "THEN", text: "assert card.closed == false and JSON schema valid ...", time: "16ms" },
        { type: "summary", text: "✔ 4/4 RestAssured API tests passed in 0.88s — TRELLO API VERIFIED" }
      ],
      totalPassed: 4
    },
    inventory: {
      featureTitle: "Feature: BUE Metabase BI & MySQL Database Integrity",
      codeSnippet: `<span class="token-kwd">Feature:</span> Database Cross-Table Integrity Gate
  <span class="token-kwd">Scenario:</span> Reconcile transactional records with Metabase BI
    <span class="token-kwd">Given</span> primary MySQL library transaction database connected
    <span class="token-kwd">When</span> cross-table join is executed against Metabase analytical tables
    <span class="token-kwd">Then</span> zero discrepancy delta is returned (delta == 0)
    <span class="token-kwd">And</span> all foreign key referential constraints are intact`,
      steps: [
        { type: "init", text: "Connecting to MySQL server & executing validation queries..." },
        { type: "step", kwd: "GIVEN", text: "MySQL connection established over secure SSL channel ...", time: "14ms" },
        { type: "step", kwd: "WHEN", text: "running complex multi-table integrity reconciliation queries ...", time: "72ms" },
        { type: "step", kwd: "THEN", text: "Source records (428,190) == Target BI records (428,190) ...", time: "24ms" },
        { type: "step", kwd: "AND", text: "assert delta == 0 and zero foreign key violations ...", time: "18ms" },
        { type: "summary", text: "✔ 4/4 database integrity checks passed in 1.12s — ZERO DATA LOSS" }
      ],
      totalPassed: 4
    }
  };

  // Switch Scenario handler
  scenarioSelect.addEventListener('change', () => {
    const selected = testSuites[scenarioSelect.value];
    if (selected) {
      featurePreview.innerHTML = `<code>${selected.codeSnippet}</code>`;
      metricTotal.textContent = selected.totalPassed;
      resetConsoleState();
    }
  });

  function resetConsoleState() {
    runnerStatusBadge.textContent = 'IDLE';
    runnerStatusBadge.className = 'terminal-badge';
    runnerProgressFill.style.width = '0%';
    metricPassed.textContent = '0';
    metricDuration.textContent = '0.00s';
  }

  // Clear Console
  btnClearConsole.addEventListener('click', () => {
    terminalConsole.innerHTML = `
      <div class="terminal-line text-muted"># Console cleared. Select a suite and click 'Execute Test Suite'.</div>
    `;
    resetConsoleState();
  });

  // Run Test Suite execution animation
  let isRunning = false;
  btnRunSuite.addEventListener('click', async () => {
    if (isRunning) return;
    isRunning = true;
    btnRunSuite.disabled = true;

    const currentSuite = testSuites[scenarioSelect.value];
    metricTotal.textContent = currentSuite.totalPassed;
    metricPassed.textContent = '0';
    runnerStatusBadge.textContent = 'RUNNING';
    runnerStatusBadge.className = 'terminal-badge';

    terminalConsole.innerHTML = `
      <div class="terminal-line"><span class="cmd-prompt">$</span> <span class="cmd-text">pytest tests/suites/test_${scenarioSelect.value}.py -v</span></div>
      <div class="terminal-line text-muted">========================== test session starts ==========================</div>
      <div class="terminal-line text-muted">rootdir: /toqa-qa-workspace, configfile: pytest.ini</div>
    `;

    const startTime = performance.now();
    let passedCount = 0;
    const steps = currentSuite.steps;

    for (let i = 0; i < steps.length; i++) {
      await sleep(280 + Math.random() * 200);

      const step = steps[i];
      const line = document.createElement('div');
      line.className = 'terminal-line';

      if (step.type === 'init') {
        line.className = 'terminal-line text-info';
        line.textContent = `[INFO] ${step.text}`;
      } else if (step.type === 'step') {
        line.innerHTML = `
          <span class="badge-tag tag-pass">PASS</span>
          <span class="test-name"><strong>[${step.kwd}]</strong> ${step.text}</span>
          <span class="test-timing">${step.time}</span>
        `;
        passedCount++;
        metricPassed.textContent = Math.min(passedCount, currentSuite.totalPassed);
      } else if (step.type === 'summary') {
        line.className = 'terminal-line text-highlight mt-2';
        line.innerHTML = `<span class="highlight-success">${step.text}</span>`;
      }

      terminalConsole.appendChild(line);
      terminalConsole.scrollTop = terminalConsole.scrollHeight;

      // Update progress bar
      const progressPercent = Math.round(((i + 1) / steps.length) * 100);
      runnerProgressFill.style.width = `${progressPercent}%`;

      const currentDuration = ((performance.now() - startTime) / 1000).toFixed(2);
      metricDuration.textContent = `${currentDuration}s`;
    }

    runnerStatusBadge.textContent = 'PASSED';
    runnerStatusBadge.className = 'terminal-badge badge-success';
    btnRunSuite.disabled = false;
    isRunning = false;
  });
}

/* ==========================================================================
   3. REST API SCHEMA & STATUS INSPECTOR
   ========================================================================== */
function initApiValidator() {
  const apiEndpointSelect = document.getElementById('apiEndpointSelect');
  const btnSendApiRequest = document.getElementById('btnSendApiRequest');
  const apiMethodBadge = document.getElementById('apiMethodBadge');
  const apiEndpointUrl = document.getElementById('apiEndpointUrl');
  const apiStatusCode = document.getElementById('apiStatusCode');
  const apiLatency = document.getElementById('apiLatency');
  const apiJsonViewer = document.getElementById('apiJsonViewer');
  const apiAssertionList = document.getElementById('apiAssertionList');

  if (!btnSendApiRequest) return;

  const endpointMocks = {
    getUser: {
      method: "GET",
      url: "/api/v1/customers/9412/profile",
      status: "200 OK",
      latencyRange: [32, 58],
      json: {
        status: "success",
        data: {
          userId: "usr_9412a",
          name: "Enterprise Client Demo",
          email: "partner@enterprise-qa.com",
          tier: "enterprise_sla",
          verified: true,
          roles: ["billing_admin", "api_developer"],
          lastAudit: "2026-09-16T22:00:00Z"
        },
        security: {
          jwtIssued: true,
          mfaEnabled: true
        },
        schema: {
          version: "v1.4",
          validatedBy: "Postman/Newman Automation"
        }
      },
      assertions: [
        "Status code is 200 OK",
        "Response time is below 250ms threshold",
        "JSON Schema conforms to UserProfileContract_v1",
        "User ID matches regex pattern ^usr_[0-9a-z]+$",
        "Sensitive credential tokens omitted from response"
      ]
    },
    postOrder: {
      method: "POST",
      url: "/api/v1/orders/validate-payload",
      status: "201 Created",
      latencyRange: [65, 110],
      json: {
        status: "created",
        orderId: "ord_2026_88319",
        itemsCount: 3,
        totalAmount: 499.50,
        currency: "USD",
        inventoryLocked: true,
        deliveryWindow: {
          estimatedDispatch: "2026-09-17T08:00:00Z",
          carrier: "Priority Express"
        },
        checksum: "sha256_94bfa2384"
      },
      assertions: [
        "Status code is 201 Created",
        "Response payload contains valid orderId token",
        "Currency format conforms to ISO-4217 standard (USD)",
        "Inventory lock flag confirmed true in database",
        "Header Content-Type equals application/json"
      ]
    },
    getMetrics: {
      method: "GET",
      url: "/api/v2/metrics/sla-status",
      status: "200 OK",
      latencyRange: [24, 45],
      json: {
        uptimeMonthly: 99.98,
        activeWorkers: 16,
        averageLatencyMs: 44.2,
        openIncidents: 0,
        regressionPassRate: "100%",
        healthCheck: {
          database: "HEALTHY",
          cacheCluster: "HEALTHY",
          queueWorker: "HEALTHY"
        }
      },
      assertions: [
        "Status code is 200 OK",
        "System uptime reported >= 99.95%",
        "All dependent services report HEALTHY status",
        "Open critical incidents equals 0",
        "SLA latency verified within agreed boundary"
      ]
    }
  };

  btnSendApiRequest.addEventListener('click', async () => {
    const selectedKey = apiEndpointSelect.value;
    const data = endpointMocks[selectedKey];
    if (!data) return;

    btnSendApiRequest.disabled = true;
    apiLatency.textContent = "Requesting...";
    apiJsonViewer.textContent = "// Dispatching request across test harness...";

    await sleep(350);

    // Update UI elements
    apiMethodBadge.textContent = data.method;
    apiMethodBadge.className = `method-badge ${data.method === 'GET' ? 'method-get' : 'method-post'}`;
    apiEndpointUrl.textContent = data.url;
    apiStatusCode.textContent = data.status;

    const randomLatency = Math.floor(Math.random() * (data.latencyRange[1] - data.latencyRange[0])) + data.latencyRange[0];
    apiLatency.textContent = `${randomLatency} ms`;

    // Render formatted JSON
    apiJsonViewer.textContent = JSON.stringify(data.json, null, 2);

    // Render Assertions
    apiAssertionList.innerHTML = data.assertions.map(item => `
      <div class="assertion-item pass">
        <span class="badge-tag tag-pass">PASS</span>
        <span>${item}</span>
      </div>
    `).join('');

    btnSendApiRequest.disabled = false;
  });
}

/* ==========================================================================
   4. SQL DATABASE INTEGRITY CHECKER
   ========================================================================== */
function initSqlValidator() {
  const btnRunSqlCheck = document.getElementById('btnRunSqlCheck');
  const dbQuerySelect = document.getElementById('dbQuerySelect');
  const sqlOutputBody = document.getElementById('sqlOutputBody');

  if (!btnRunSqlCheck) return;

  const sqlScenarios = {
    row_count: {
      title: "Row Count Reconciliation (Source vs BI Target)",
      tableRows: [
        { date: "2026-09-16", src: "428,190", bi: "428,190", delta: "0", status: "100% MATCH" },
        { date: "2026-09-15", src: "395,442", bi: "395,442", delta: "0", status: "100% MATCH" },
        { date: "2026-09-14", src: "411,880", bi: "411,880", delta: "0", status: "100% MATCH" }
      ],
      total: "1,235,512",
      discrepancy: "0 (0.000%)",
      time: "184 ms"
    },
    financial_sum: {
      title: "Financial Total Hash & Sum Balancing",
      tableRows: [
        { date: "2026-09-16", src: "$1,429,540.00", bi: "$1,429,540.00", delta: "$0.00", status: "BALANCED" },
        { date: "2026-09-15", src: "$984,200.50", bi: "$984,200.50", delta: "$0.00", status: "BALANCED" },
        { date: "2026-09-14", src: "$1,120,410.20", bi: "$1,120,410.20", delta: "$0.00", status: "BALANCED" }
      ],
      total: "$3,534,150.70",
      discrepancy: "$0.00 (Zero variance)",
      time: "215 ms"
    },
    null_audit: {
      title: "Strict NOT-NULL & Foreign Key Referential Integrity",
      tableRows: [
        { date: "tbl_orders", src: "Foreign Key Valid", bi: "No Orphan Rows", delta: "0", status: "VERIFIED" },
        { date: "tbl_customers", src: "Non-Null Emails", bi: "Unique Index OK", delta: "0", status: "VERIFIED" },
        { date: "tbl_payments", src: "Tx Signature OK", bi: "1:1 Mapping", delta: "0", status: "VERIFIED" }
      ],
      total: "842,109 rows scanned",
      discrepancy: "0 Integrity Violations",
      time: "142 ms"
    }
  };

  btnRunSqlCheck.addEventListener('click', async () => {
    btnRunSqlCheck.disabled = true;
    const ruleKey = dbQuerySelect.value;
    const current = sqlScenarios[ruleKey] || sqlScenarios.row_count;

    sqlOutputBody.innerHTML = `
      <div style="padding: 2rem; text-align: center; color: var(--text-muted); font-family: var(--font-mono);">
        Scanning database tables & executing cross-reconciliation joins...
      </div>
    `;

    await sleep(400);

    const rowsHtml = current.tableRows.map(r => `
      <tr>
        <td>${r.date}</td>
        <td>${r.src}</td>
        <td>${r.bi}</td>
        <td><span class="text-success">${r.delta}</span></td>
        <td><span class="badge-tag tag-pass">${r.status}</span></td>
      </tr>
    `).join('');

    sqlOutputBody.innerHTML = `
      <div class="sql-result-table-wrap">
        <table class="sql-table">
          <thead>
            <tr>
              <th>Target / Partition</th>
              <th>Source Output</th>
              <th>Destination BI Output</th>
              <th>Delta Variance</th>
              <th>Integrity Status</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      </div>

      <div class="sql-summary-box">
        <div class="sql-stat-item">
          <span class="label">Scope Audited:</span>
          <span class="val">${current.total}</span>
        </div>
        <div class="sql-stat-item">
          <span class="label">Discrepancies:</span>
          <span class="val text-success">${current.discrepancy}</span>
        </div>
        <div class="sql-stat-item">
          <span class="label">Query Latency:</span>
          <span class="val">${current.time}</span>
        </div>
      </div>
    `;

    btnRunSqlCheck.disabled = false;
  });
}

// Utility Sleep Promise
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
