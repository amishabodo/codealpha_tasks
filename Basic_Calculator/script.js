class CalculatorUI {
  constructor() {
    this.expressionLog = document.getElementById('expressionLog');
    this.currentValueText = document.getElementById('currentValue');
    this.clearState();
    this.initKeyboardBindings();
  }

  clearState() {
    this.currentInput = '0';
    this.previousInput = '';
    this.operator = undefined;
    this.isResetReady = false;
    this.updateDisplay();
  }

  deleteDigit() {
    if (this.isResetReady) {
      this.clearState();
      return;
    }
    if (this.currentInput === '0' || this.currentInput.length === 1) {
      this.currentInput = '0';
    } else {
      this.currentInput = this.currentInput.slice(0, -1);
    }
    this.updateDisplay();
  }

  appendValue(value) {
    // Reset canvas screen parameters if completing a calculations link chain
    if (this.isResetReady) {
      this.currentInput = value === '.' ? '0.' : value;
      this.isResetReady = false;
      this.updateDisplay();
      return;
    }

    // Constraint validations
    if (value === '.' && this.currentInput.includes('.')) return;
    if (this.currentInput.length >= 15) return; // Cap visual clipping limits

    if (this.currentInput === '0' && value !== '.') {
      this.currentInput = value;
    } else {
      this.currentInput += value;
    }
    this.updateDisplay();
  }

  handleOperator(selectedOperator) {
    if (this.operator && !this.isResetReady) {
      this.executeCalculation();
    }
    
    this.previousInput = this.currentInput;
    this.operator = selectedOperator;
    this.isResetReady = false;
    
    // Format presentation string tokens variables gracefully
    const displayOp = this.getOperatorSymbol(selectedOperator);
    this.expressionLog.textContent = `${this.previousInput} ${displayOp}`;
    this.currentInput = '0';
    this.updateDisplay();
  }

  executeCalculation() {
    let output = 0;
    const prev = parseFloat(this.previousInput);
    const current = parseFloat(this.currentInput);

    if (isNaN(prev) || isNaN(current)) return;

    switch (this.operator) {
      case '+': output = prev + current; break;
      case '-': output = prev - current; break;
      case '*': output = prev * current; break;
      case '/': 
        if (current === 0) {
          this.runtimeError("Zero Error");
          return;
        }
        output = prev / current; 
        break;
      default: return;
    }

    // Floating absolute rounding configuration precision handling balances
    output = Math.round(output * 100000000) / 100000000;

    this.expressionLog.textContent = `${this.previousInput} ${this.getOperatorSymbol(this.operator)} ${this.currentInput} =`;
    this.currentInput = output.toString();
    this.operator = undefined;
    this.previousInput = '';
    this.isResetReady = true;
    this.updateDisplay();
  }

  runtimeError(message) {
    this.clearState();
    this.currentValueText.textContent = message;
    this.isResetReady = true;
  }

  getOperatorSymbol(op) {
    if (op === '*') return '×';
    if (op === '/') return '÷';
    return op;
  }

  updateDisplay() {
    this.currentValueText.textContent = this.currentInput;
  }

  /* ==========================================================================
     Keyboard Physical Support Integrations
     ========================================================================== */
  initKeyboardBindings() {
    document.addEventListener('keydown', (e) => {
      let selector = '';
      
      if (!isNaN(e.key) || e.key === '.') {
        this.appendValue(e.key);
        selector = `button[data-value="${e.key}"]`;
      } else if (['+', '-', '*', '/'].includes(e.key)) {
        this.handleOperator(e.key);
        selector = `button[data-value="${e.key}"]`;
      } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        this.executeCalculation();
        selector = `button[data-type="equals"]`;
      } else if (e.key === 'Backspace') {
        this.deleteDigit();
        selector = `button[data-type="delete"]`;
      } else if (e.key === 'Escape') {
        this.clearState();
        selector = `button[data-type="clear"]`;
      }

      // Add visual active button response to hardware tracking keystrokes
      if (selector) {
        const activeBtn = document.querySelector(selector);
        if (activeBtn) {
          activeBtn.classList.add('active-press');
          setTimeout(() => activeBtn.classList.remove('active-press'), 100);
        }
      }
    });
  }
}

// Instantiate Global Driver Execution Scope Loop context bindings
document.addEventListener('DOMContentLoaded', () => {
  const calc = new CalculatorUI();

  document.querySelector('.keypad').addEventListener('click', (e) => {
    const target = e.target;
    if (!target.classList.contains('btn')) return;

    const value = target.getAttribute('data-value');
    const type = target.getAttribute('data-type');

    if (value) {
      if (target.classList.contains('num-btn')) calc.appendValue(value);
      if (target.classList.contains('operator-btn')) calc.handleOperator(value);
    } else if (type) {
      if (type === 'clear') calc.clearState();
      if (type === 'delete') calc.deleteDigit();
      if (type === 'equals') calc.executeCalculation();
    }
  });
});