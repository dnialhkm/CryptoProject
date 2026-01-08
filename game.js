    // ============================================
    // GAME DATA
    // ============================================
    
    const gameData = {
      // Case 1 Data (Combined Puzzle)
      case1: {
        title: "The Intercepted Blueprint",
        briefing: "A classified building blueprint was sent from Agent Echo to HQ. Intelligence suggests the message may have been intercepted and altered. Your mission: Analyze the cryptographic evidence to determine if the blueprint was tampered with during transmission.",
        originalMessage: "BLUEPRINT-X7: Foundation depth 15m, steel reinforcement grade A500, load capacity 2500kN. Authorization: ECHO-ALPHA-7.",
        receivedMessage: "BLUEPRINT-X7: Foundation depth 10m, steel reinforcement grade A200, load capacity 1500kN. Authorization: ECHO-ALPHA-7.",
        originalHash: "a7f3bc9d2e1f8a4b5c6d7e8f9a0b1c2d",
        receivedHash: "x9y8z7w6v5u4t3s2r1q0p9o8n7m6l5k4",
        hashMatch: false,
        signatureValid: true,
        encryptionApplied: true,
        isTampered: true
      },
      
      // Case 2 Data (Two Suspect Messages)
      case2: {
        title: "The Double Message Mystery",
        briefing: "Two versions of a crucial mission update from Agent Shadow have reached HQ. One is genuine and the other is a forgery. Use your skills in hash verification and digital signature analysis to determine which message was altered.",
        messageA: "Operation Nightfall proceeds at 0300 hours.\nExtraction point: Delta-7. \nAll agents confirm status.",
        messageB: "Operation Nightfall proceeds at 0800 hours.\nExtraction point: Alpha-2.\nAll agents stand down.",
        hashA: "b8g4hc0e3f2g9b5c6d7e8f9a0b1c2d3e",
        hashB: "k5l6m7n8o9p0q1r2s3t4u5v6w7x8y9z0",
        originalHash: "b8g4hc0e3f2g9b5c6d7e8f9a0b1c2d3e",
        signatureAValid: true,
        signatureBValid: false,
        authenticMessage: "A",
        tamperedMessage: "B"
      },
      
      // Case 3 Data (Final Mission)
      case3: {
        title: "The Final Cipher",
        briefing: "This is your final mission, Detective. A critical intelligence report has been received, but our analysts suspect it may have been compromised. Use all your cryptographic skills to verify its authenticity.",
        originalMessage: "Priority Alpha clearance granted.\nAsset extraction: 0600 hours.\nExtraction team: Delta Squad.\nConfirmation code: ECHO-7",
        receivedMessage: "Priority Alpha clearance granted.\nAsset extraction: 0800 hours.\nExtraction team: Delta Squad.\nConfirmation code: ECHO-7",
        originalHash: "f1e2d3c4b5a69788990a1b2c3d4e5f6g",
        receivedHash: "z0y9x8w7v6u5t4s3r2q1p0o9n8m7l6k5",
        hashMatch: false,
        signatureValid: false,
        encryptionApplied: true,
        isTampered: true
      }
    };

    const aiHints = {
      case1: {
        hash: "Look closely at the hash values. If even one character is different, the entire message has been modified. Compare character by character!",
        signature: "A valid digital signature means the sender is verified. But remember, the content could still be different from what was originally signed.",
        encryption: "Remember: Encryption protects the message from being read by others - like a locked box. It's about privacy!"
      },
      case2: {
        hash: "Compare each message's hash to the original hash. The authentic message will have a matching hash.",
        signature: "A valid digital signature confirms the message came from the real sender. An invalid signature is a red flag!"
      },
      case3: {
        hash: "Compare these hashes carefully. Different hashes mean different content!",
        signature: "An invalid digital signature is strong evidence of tampering. The real sender didn't authorize this message.",
        encryption: "Remember: Encryption protects the message from being read by others - like a locked box. It's about privacy!"
      }
    };

    // ============================================
    // GAME STATE
    // ============================================
    
    let gameState = {
      started: false,
      currentCase: 1,
      currentStep: 0,
      selections: {
        case1: { hash: null, signature: null, encryption: null, verdict: null },
        case2: { hash: null, signature: null },
        case3: { hash: null, signature: null, encryption: null, verdict: null }
      },
      completed: false
    };

    const caseSteps = {
      1: ['briefing', 'messages', 'hash', 'signature', 'encryption', 'evidence'],
      2: ['briefing', 'compare', 'hash', 'signature', 'evidence'],
      3: ['briefing', 'messages', 'hash', 'signature', 'encryption', 'evidence']
    };

    // ============================================
    // RENDERING FUNCTIONS
    // ============================================
    
    function render() {
      const app = document.getElementById('app');
      
      if (gameState.completed) {
        app.innerHTML = renderGameComplete();
        return;
      }
      
      if (!gameState.started) {
        app.innerHTML = renderHomeScreen();
        return;
      }
      
      const currentSteps = caseSteps[gameState.currentCase];
      const currentStepName = currentSteps[gameState.currentStep];
      
      let content = renderHeader();
      content += renderProgressIndicator();
      content += `<div class="screen">`;
      
      switch(currentStepName) {
        case 'briefing':
          content += renderBriefingScreen();
          break;
        case 'messages':
          content += renderMessageContextScreen();
          break;
        case 'compare':
          content += renderCompareMessagesScreen();
          break;
        case 'hash':
          content += gameState.currentCase === 2 ? renderHashComparisonScreen() : renderHashCheckScreen();
          break;
        case 'signature':
          content += gameState.currentCase === 2 ? renderCase2SignatureScreen() : renderSignatureCheckScreen();
          break;
        case 'encryption':
          content += renderEncryptionScreen();
          break;
        case 'evidence':
          content += gameState.currentCase === 2 ? renderCase2EvidenceScreen() : renderEvidenceSummaryScreen();
          break;
      }
      
      content += `</div>`;
      app.innerHTML = content;
    }

    function renderHomeScreen() {
      return `
        <div class="home-screen">
          <div class="home-badge">🔐 Educational Cryptography Game</div>
          <h1 class="home-title">CryptoDetective</h1>
          <p class="home-subtitle">
            Master the art of cryptographic investigation. Learn to verify message integrity 
            using hashes, digital signatures, and encryption analysis.
          </p>
          <div class="home-features">
            <div class="home-feature">🔍 3 Cases</div>
            <div class="home-feature">🧩 Interactive Puzzles</div>
            <div class="home-feature">🤖 AI Hints</div>
          </div>
          <button class="btn btn-detective btn-xl" onclick="startGame()">
            🎯 Start Investigation
          </button>
        </div>
      `;
    }

    function renderHeader() {
      return `
        <header class="game-header">
          <div class="game-title">
            <span style="font-size: 1.5rem;">🔍</span>
            <h1 class="font-serif">CryptoDetective</h1>
          </div>
          <div class="case-badge">Case ${gameState.currentCase} of 3</div>
        </header>
      `;
    }

    function renderProgressIndicator() {
      const steps = caseSteps[gameState.currentCase];
      const stepLabels = {
        'briefing': 'Briefing',
        'messages': 'Messages',
        'compare': 'Compare',
        'hash': 'Hash',
        'signature': 'Signature',
        'encryption': 'Encryption',
        'evidence': 'Evidence'
      };
      
      let html = `<div class="progress-indicator" style="margin-bottom: 2rem; justify-content: center; flex-wrap: wrap;">`;
      
      steps.forEach((step, index) => {
        const isCompleted = index < gameState.currentStep;
        const isActive = index === gameState.currentStep;
        
        if (index > 0) {
          html += `<div class="progress-line ${isCompleted ? 'completed' : ''}"></div>`;
        }
        
        html += `
          <div class="progress-step">
            <div class="progress-dot ${isCompleted ? 'completed' : isActive ? 'active' : 'inactive'}">
              ${isCompleted ? '✓' : index + 1}
            </div>
            <span class="progress-label">${stepLabels[step]}</span>
          </div>
        `;
      });
      
      html += `</div>`;
      return html;
    }

    function renderBriefingScreen() {
      const caseData = gameData[`case${gameState.currentCase}`];
      return `
        <div class="briefing-card detective-card">
          <div class="briefing-icon">📋</div>
          <div class="briefing-content">
            <h3>${caseData.title}</h3>
            <p>${caseData.briefing}</p>
            <button class="btn btn-detective btn-lg" onclick="nextStep()">
              🚀 Start Investigation
            </button>
          </div>
        </div>
      `;
    }

    function renderMessageContextScreen() {
      const caseData = gameData[`case${gameState.currentCase}`];
      return `
        <div class="screen-title">
          <h2>Message Analysis</h2>
          <p>Compare the original message with what was received</p>
        </div>
        
        <div class="alert-box alert-accent">
          <span>💡</span>
          <p><strong>Detective Tip:</strong> Look carefully at both messages. Any differences, no matter how small, could be evidence of tampering.</p>
        </div>

        <div class="message-container">
          <div>
            <div class="message-header">
              <span style="color: var(--detective-blue);">📄</span>
              <h3>Original Message</h3>
              <span class="message-label">Sent by sender</span>
            </div>
            <div class="message-box message-original">${caseData.originalMessage}</div>
          </div>
          <div>
            <div class="message-header">
              <span style="color: hsl(270, 50%, 60%);">⚠️</span>
              <h3>Received Message</h3>
              <span class="message-label">Received at HQ</span>
            </div>
            <div class="message-box message-received">${caseData.receivedMessage}</div>
          </div>
        </div>
        
        ${renderNavigation(true, true, 'Analyze Hash')}
      `;
    }

    function renderCompareMessagesScreen() {
      const caseData = gameData.case2;
      return `
        <div class="screen-title">
          <h2>Compare Suspect Messages</h2>
          <p>HQ received two different versions. One is authentic, one is forged.</p>
        </div>
        
        <div class="alert-box alert-warning">
          <span>⚠️</span>
          <p><strong>Warning:</strong> Only ONE of these messages is genuine. Look for differences that could indicate tampering.</p>
        </div>
        
        <div class="message-comparison">
          <div class="suspect-message">
            <span class="suspect-label suspect-a">Message A</span>
            <div class="message-box message-original">${caseData.messageA}</div>
          </div>
          <div class="suspect-message">
            <span class="suspect-label suspect-b">Message B</span>
            <div class="message-box message-received">${caseData.messageB}</div>
          </div>
        </div>
        
        ${renderNavigation(true, true, 'Analyze Hashes')}
      `;
    }

    function renderHashCheckScreen() {
      const caseData = gameData[`case${gameState.currentCase}`];
      const selection = gameState.selections[`case${gameState.currentCase}`].hash;
      const isCorrect = selection === (caseData.hashMatch ? 'match' : 'mismatch');
      
      return `
        <div class="screen-title">
          <h2>Hash Verification</h2>
          <p>Compare the hash values to detect any changes</p>
        </div>
        
        <div class="alert-box alert-accent">
          <span>🔑</span>
          <p>A hash is like a digital fingerprint. If the message changes, even by one character, the hash will be completely different.</p>
        </div>
        
        <div class="hash-display">
          <div class="hash-header">
            <div class="hash-label">
              <span style="color: var(--primary);">#</span>
              <span>Original Hash</span>
            </div>
          </div>
          <div class="hash-value hash-neutral">${caseData.originalHash}</div>
        </div>
        
        <div class="hash-display">
          <div class="hash-header">
            <div class="hash-label">
              <span style="color: var(--primary);">#</span>
              <span>Received Hash</span>
            </div>
            ${selection ? `<span style="color: ${caseData.hashMatch ? 'var(--success)' : 'var(--destructive)'};">${caseData.hashMatch ? '✓' : '✗'}</span>` : ''}
          </div>
          <div class="hash-value ${selection ? (caseData.hashMatch ? 'hash-match' : 'hash-mismatch') : 'hash-neutral'}">${caseData.receivedHash}</div>
        </div>
        
        <div style="text-align: center;">
            <p style="color: var(--muted-foreground); margin-bottom: 1rem;">Do these hashes match?</p>
            <div class="choice-container">
            ${renderChoiceButton('match', 'Match', selection, caseData.hashMatch, 'hash')}
            ${renderChoiceButton('mismatch', 'Do Not Match', selection, !caseData.hashMatch, 'hash')}
            </div>
        </div>
        
        ${renderNavigation(true, selection && isCorrect, 'Check Signature')}
      `;
    }

    function renderHashComparisonScreen() {
      const caseData = gameData.case2;
      const selection = gameState.selections.case2.hash;
      const hashAMatch = caseData.hashA === caseData.originalHash;
      const hashBMatch = caseData.hashB === caseData.originalHash;
      const isCorrect = selection === caseData.authenticMessage;
      
      return `
        <div class="screen-title">
          <h2>Hash Comparison</h2>
          <p>Compare each message's hash against the original hash on record. The authentic message will have a matching hash.</p>
        </div>
        
        <div class="hash-display">
          <div class="hash-header">
            <div class="hash-label">
              <span style="color: var(--primary);">#</span>
              <span>Original Hash (On Record)</span>
            </div>
          </div>
          <div class="hash-value hash-neutral">${caseData.originalHash}</div>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
          <div class="hash-display">
            <div class="hash-header">
              <div class="hash-label">
                <span class="suspect-label suspect-a" style="font-size: 0.75rem;">A</span>
                <span>Message A Hash</span>
              </div>
              ${selection ? `<span style="color: ${hashAMatch ? 'var(--success)' : 'var(--destructive)'};">${hashAMatch ? '✓' : '✗'}</span>` : ''}
            </div>
            <div class="hash-value ${selection ? (hashAMatch ? 'hash-match' : 'hash-mismatch') : 'hash-neutral'}">${caseData.hashA}</div>
          </div>
          <div class="hash-display">
            <div class="hash-header">
              <div class="hash-label">
                <span class="suspect-label suspect-b" style="font-size: 0.75rem;">B</span>
                <span>Message B Hash</span>
              </div>
              ${selection ? `<span style="color: ${hashBMatch ? 'var(--success)' : 'var(--destructive)'};">${hashBMatch ? '✓' : '✗'}</span>` : ''}
            </div>
            <div class="hash-value ${selection ? (hashBMatch ? 'hash-match' : 'hash-mismatch') : 'hash-neutral'}">${caseData.hashB}</div>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 1.5rem;">
          <p style="color: var(--muted-foreground); margin-bottom: 1rem;">Which message has the authentic hash?</p>
          <div class="choice-container">
            ${renderChoiceButton('A', 'Message A', selection, caseData.authenticMessage === 'A', 'hash')}
            ${renderChoiceButton('B', 'Message B', selection, caseData.authenticMessage === 'B', 'hash')}
          </div>
        </div>
        
        ${renderNavigation(true, selection && isCorrect, 'Check Signatures')}
      `;
    }

    function renderSignatureCheckScreen() {
      const caseData = gameData[`case${gameState.currentCase}`];
      const selection = gameState.selections[`case${gameState.currentCase}`].signature;
      const isCorrect = selection === (caseData.signatureValid ? 'authentic' : 'tampered');
      
      return `
        <div class="screen-title">
          <h2>Digital Signature Verification</h2>
          <p>Verify if the message was signed by the authentic sender</p>
        </div>
        
        <div class="alert-box alert-accent">
          <span>🔏</span>
          <p>A digital signature confirms who sent the message. A valid signature means the message came from the correct sender.</p>
        </div>
        
        <div class="signature-status ${caseData.signatureValid ? 'signature-valid' : 'signature-invalid'}">
          <span style="font-size: 2rem;">${caseData.signatureValid ? '🛡️' : '⚠️'}</span>
          <div>
            <div style="font-weight: 600; margin-bottom: 0.25rem;">Signature Status</div>
            <div class="signature-text ${caseData.signatureValid ? 'valid' : 'invalid'}">
              ${caseData.signatureValid ? '✓ VALID' : '✗ INVALID'}
            </div>
          </div>
        </div>
        
        <div style="text-align: center;">
          <p style="color: var(--muted-foreground); margin-bottom: 1rem;">Based on the signature, is this message authentic or tampered?</p>
          <div class="choice-container">
            ${renderChoiceButton('authentic', 'Authentic', selection, caseData.signatureValid, 'signature')}
            ${renderChoiceButton('tampered', 'Tampered', selection, !caseData.signatureValid, 'signature')}
          </div>
        </div>
        
        ${renderNavigation(true, selection && isCorrect, 'Check Encryption')}
      `;
    }

    function renderCase2SignatureScreen() {
      const caseData = gameData.case2;
      const selection = gameState.selections.case2.signature;
      const isCorrect = selection === caseData.tamperedMessage;
      
      return `
        <div class="screen-title">
          <h2>Digital Signature Verification</h2>
          <p>Check the digital signature status for each message. An invalid signature indicates the message was not properly signed by the sender.</p>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 1.5rem;">
          <div class="signature-status ${caseData.signatureAValid ? 'signature-valid' : 'signature-invalid'}">
            <span class="suspect-label suspect-a">A</span>
            <span style="font-size: 1.5rem;">${caseData.signatureAValid ? '🛡️' : '⚠️'}</span>
            <span class="signature-text ${caseData.signatureAValid ? 'valid' : 'invalid'}">
              ${caseData.signatureAValid ? 'VALID' : 'INVALID'}
            </span>
          </div>
          <div class="signature-status ${caseData.signatureBValid ? 'signature-valid' : 'signature-invalid'}">
            <span class="suspect-label suspect-b">B</span>
            <span style="font-size: 1.5rem;">${caseData.signatureBValid ? '🛡️' : '⚠️'}</span>
            <span class="signature-text ${caseData.signatureBValid ? 'valid' : 'invalid'}">
              ${caseData.signatureBValid ? 'VALID' : 'INVALID'}
            </span>
          </div>
        </div>
        
        <div style="text-align: center;">
          <p style="color: var(--muted-foreground); margin-bottom: 1rem;">Which message was tampered with?</p>
          <div class="choice-container">
            ${renderChoiceButton('A', 'Message A', selection, caseData.tamperedMessage === 'A', 'signature')}
            ${renderChoiceButton('B', 'Message B', selection, caseData.tamperedMessage === 'B', 'signature')}
          </div>
        </div>
        
        ${renderNavigation(true, selection && isCorrect, 'View Evidence')}
      `;
    }

    function renderEncryptionScreen() {
      const caseData = gameData[`case${gameState.currentCase}`];
      const selection = gameState.selections[`case${gameState.currentCase}`].encryption;
      const isCorrect = selection === 'hide';
      
      const encryptedText = "Xmzk@#$%^&*()_+{}|:<>?~`-=[]\\;',./";
      
      return `
        <div class="screen-title">
          <h2>Encryption Analysis</h2>
          <p>Learn the purpose of encryption</p>
        </div>

        <div class="alert-box alert-accent">
          <span>🔏</span>
          <p>Encryption transforms readable text into scrambled code. Only someone with the decryption key can read the original message.</p>
        </div>
        
        <div class="encryption-container">
          <div class="encryption-box encrypted-box">
            <div class="encryption-header">
              <span>🔒</span>
              <span>Encrypted Message (During Transmission)</span>
            </div>
            <div class="encryption-content">${encryptedText}</div>
          </div>
          <div class="encryption-box decrypted-box">
            <div class="encryption-header">
              <span>🔓</span>
              <span>Decrypted Message (With Key)</span>
            </div>
            <div class="encryption-content">${caseData.originalMessage.substring(0, 50)}...</div>
          </div>
        </div>
        
        <div style="text-align: center;">
          <p style="color: var(--muted-foreground); margin-bottom: 1rem;">What is the primary purpose of encryption?</p>
          <div class="choice-container">
            ${renderChoiceButton('hide', 'To hide message content', selection, true, 'encryption')}
            ${renderChoiceButton('verify', 'To verify integrity', selection, false, 'encryption')}
          </div>
        </div>
        
        ${renderNavigation(true, selection && isCorrect, 'View Evidence Summary')}
      `;
    }

    function renderEvidenceSummaryScreen() {
      const caseData = gameData[`case${gameState.currentCase}`];
      const selection = gameState.selections[`case${gameState.currentCase}`].verdict;
      const isCorrect = selection === (caseData.isTampered ? 'tampered' : 'authentic');
      
      const evidence = [
        { category: 'Hash Comparison', finding: caseData.hashMatch ? 'Hashes match' : 'Hashes are different', status: caseData.hashMatch ? 'match' : 'mismatch' },
        { category: 'Digital Signature', finding: caseData.signatureValid ? 'Signature verified' : 'Signature invalid', status: caseData.signatureValid ? 'valid' : 'invalid' },
        { category: 'Encryption', finding: caseData.encryptionApplied ? 'Encryption was applied' : 'No encryption', status: caseData.encryptionApplied ? 'applied' : 'not-applied' }
      ];
      
      return `
        <div class="screen-title">
          <h2>Evidence Summary</h2>
          <p>Review all evidence and make your final verdict</p>
        </div>
        
        <div class="detective-card">
          <h3 style="font-family: Georgia, serif; font-size: 1.25rem; margin-bottom: 1rem;">📋 Evidence Summary</h3>
          <table class="evidence-table">
            <thead>
              <tr>
                <th>Evidence Type</th>
                <th>Finding</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${evidence.map(e => `
                <tr>
                  <td style="font-weight: 500;">${e.category}</td>
                  <td style="color: var(--muted-foreground);">${e.finding}</td>
                  <td class="${e.status === 'match' || e.status === 'valid' || e.status === 'applied' ? 'evidence-match' : 'evidence-mismatch'}">
                    ${e.status === 'match' ? 'Match' : e.status === 'mismatch' ? 'Different' : e.status === 'valid' ? 'Valid' : e.status === 'invalid' ? 'Invalid' : e.status === 'applied' ? 'Applied' : 'Not Applied'}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        
        <div class="verdict-section">
          <h3 class="verdict-title">⚖️ Final Verdict</h3>
          <p style="color: var(--muted-foreground); margin-bottom: 1rem;">Based on all the evidence, is this message authentic or tampered?</p>
          <div class="choice-container">
            ${renderVerdictButton('authentic', '✓ Authentic', selection, !caseData.isTampered)}
            ${renderVerdictButton('tampered', '✗ Tampered', selection, caseData.isTampered)}
          </div>
          
          ${selection ? `
            <div class="result-message ${isCorrect ? 'result-success' : 'result-error'}">
              ${isCorrect ? '🎉 Excellent work, Detective! Case solved!' : '❌ Review the evidence again, Detective.'}
            </div>
          ` : ''}
        </div>
        
        ${renderNavigation(true, selection && isCorrect, gameState.currentCase < 3 ? 'Next Case' : 'Complete Game')}
      `;
    }

    function renderCase2EvidenceScreen() {
      const caseData = gameData.case2;
      const selection = gameState.selections.case2.verdict;
      const isCorrect = selection === caseData.authenticMessage;
      
      const evidence = [
        { category: 'Hash A', finding: 'Matches original hash', status: 'match' },
        { category: 'Hash B', finding: 'Different from original', status: 'mismatch' },
        { category: 'Signature A', finding: 'Valid signature', status: 'valid' },
        { category: 'Signature B', finding: 'Invalid signature', status: 'invalid' }
      ];
      
      return `
        <div class="screen-title">
          <h2>Case 2 Evidence Summary</h2>
          <p>Review the evidence and identify the authentic message</p>
        </div>
        
        <div class="detective-card">
          <h3 style="font-family: Georgia, serif; font-size: 1.25rem; margin-bottom: 1rem;">📋 Evidence Summary</h3>
          <table class="evidence-table">
            <thead>
              <tr>
                <th>Evidence Type</th>
                <th>Finding</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${evidence.map(e => `
                <tr>
                  <td style="font-weight: 500;">${e.category}</td>
                  <td style="color: var(--muted-foreground);">${e.finding}</td>
                  <td class="${e.status === 'match' || e.status === 'valid' ? 'evidence-match' : 'evidence-mismatch'}">
                    ${e.status === 'match' ? 'Match' : e.status === 'mismatch' ? 'Different' : e.status === 'valid' ? 'Valid' : 'Invalid'}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        
        <div class="verdict-section">
          <h3 class="verdict-title">⚖️ Final Verdict</h3>
          <p style="color: var(--muted-foreground); margin-bottom: 1rem;">Which message is the authentic one?</p>
          <div class="choice-container">
            ${renderVerdictButton('A', 'Message A', selection, caseData.authenticMessage === 'A')}
            ${renderVerdictButton('B', 'Message B', selection, caseData.authenticMessage === 'B')}
          </div>
          
          ${selection ? `
            <div class="result-message ${isCorrect ? 'result-success' : 'result-error'}">
              ${isCorrect ? '🎉 Excellent work, Detective! Case solved!' : '❌ Review the evidence again, Detective.'}
            </div>
          ` : ''}
        </div>
        
        ${renderNavigation(true, selection && isCorrect, 'Next Case')}
      `;
    }

    function renderGameComplete() {
      return `
        <div class="game-complete">
          <div class="trophy-icon">🏆</div>
          <h1 class="font-serif" style="font-size: 2.5rem; margin-bottom: 0.5rem;">Congratulations, Detective!</h1>
          <p style="color: var(--muted-foreground); font-size: 1.125rem; margin-bottom: 2rem;">
            You've successfully completed all cases and mastered cryptographic investigation.
          </p>
          
          <div class="skills-grid">
            <div class="skill-card">
              <div class="skill-icon">#️⃣</div>
              <div class="skill-name">Hash Verification</div>
              <p> Detecting content changes </p>
            </div>
            <div class="skill-card">
              <div class="skill-icon">🔏</div>
              <div class="skill-name">Digital Signatures</div>
              <p> Verify if the sender is authentic </p>
            </div>
            <div class="skill-card">
              <div class="skill-icon">🔐</div>
              <div class="skill-name">Encryption Awareness</div>
              <p> Understanding message protection </p>
            </div>
            <div class="skill-card">
              <div class="skill-icon">🔍</div>
              <div class="skill-name">Evidence Analysis</div>
              <p> Use all clues to make a decision </p>
            </div>
          </div>
          
          <button class="btn btn-detective btn-xl" onclick="restartGame()">
            🔄 Play Again
          </button>
        </div>
      `;
    }

    function renderChoiceButton(value, label, selection, isCorrectChoice, field) {
      const isSelected = selection === value;
      let btnClass = 'btn btn-evidence choice-btn';
      
      if (isSelected) {
        btnClass = isCorrectChoice ? 'btn btn-correct choice-btn' : 'btn btn-incorrect choice-btn';
      }
      
      return `
        <button class="${btnClass}" onclick="selectChoice('${field}', '${value}', ${isCorrectChoice})">
          ${isSelected ? (isCorrectChoice ? '✓ ' : '✗ ') : ''}${label}
        </button>
      `;
    }

    function renderVerdictButton(value, label, selection, isCorrectChoice) {
      const isSelected = selection === value;
      let btnClass = 'btn btn-evidence choice-btn btn-lg';
      
      if (isSelected) {
        btnClass = isCorrectChoice ? 'btn btn-correct choice-btn btn-lg' : 'btn btn-incorrect choice-btn btn-lg';
      }
      
      return `
        <button class="${btnClass}" onclick="selectVerdict('${value}', ${isCorrectChoice})">
          ${label}
        </button>
      `;
    }

    function renderNavigation(showBack, showNext, nextLabel = 'Next') {
      return `
        <div class="navigation">
          ${showBack && gameState.currentStep > 0 ? `
            <button class="btn btn-navigation" onclick="prevStep()">
              ← Back
            </button>
          ` : '<div></div>'}
          ${showNext ? `
            <button class="btn btn-detective" onclick="nextStep()">
              ${nextLabel} →
            </button>
          ` : ''}
        </div>
      `;
    }

    // ============================================
    // GAME LOGIC
    // ============================================
    
    function startGame() {
      gameState.started = true;
      gameState.currentCase = 1;
      gameState.currentStep = 0;
      render();
    }

    function restartGame() {
      gameState = {
        started: false,
        currentCase: 1,
        currentStep: 0,
        selections: {
          case1: { hash: null, signature: null, encryption: null, verdict: null },
          case2: { hash: null, signature: null, verdict: null },
          case3: { hash: null, signature: null, encryption: null, verdict: null }
        },
        completed: false
      };
      render();
    }

    function nextStep() {
      const steps = caseSteps[gameState.currentCase];
      
      if (gameState.currentStep < steps.length - 1) {
        gameState.currentStep++;
      } else {
        // Move to next case or complete game
        if (gameState.currentCase < 3) {
          gameState.currentCase++;
          gameState.currentStep = 0;
        } else {
          gameState.completed = true;
        }
      }
      
      hideAIHint();
      render();
    }

    function prevStep() {
      if (gameState.currentStep > 0) {
        gameState.currentStep--;
        hideAIHint();
        render();
      }
    }

    function selectChoice(field, value, isCorrect) {
      gameState.selections[`case${gameState.currentCase}`][field] = value;
      
      if (!isCorrect) {
        showAIHint(field);
      } else {
        hideAIHint();
      }
      
      render();
    }

    function selectVerdict(value, isCorrect) {
      if (gameState.currentCase === 2) {
        gameState.selections.case2.verdict = value;
      } else {
        gameState.selections[`case${gameState.currentCase}`].verdict = value;
      }
      
      if (!isCorrect) {
        showAIHint('verdict');
      } else {
        hideAIHint();
      }
      
      render();
    }

    // ============================================
    // AI HINT SYSTEM
    // ============================================
    
    function showAIHint(field) {
      const caseHints = aiHints[`case${gameState.currentCase}`];
      let hint = '';
      
      switch(field) {
        case 'hash':
          hint = caseHints.hash;
          break;
        case 'signature':
          hint = caseHints.signature;
          break;
        case 'encryption':
          hint = caseHints.encryption;
          break;
        case 'verdict':
          hint = "Review all the evidence carefully. Each piece tells part of the story!";
          break;
      }
      
      if (hint) {
        document.getElementById('ai-message').textContent = hint;
        document.getElementById('ai-assistant').classList.remove('hidden');
      }
    }

    function hideAIHint() {
      document.getElementById('ai-assistant').classList.add('hidden');
    }

    // ============================================
    // INITIALIZE
    // ============================================
    
    document.addEventListener('DOMContentLoaded', function() {
      render();
    });