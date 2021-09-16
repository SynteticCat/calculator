import React, { useState, useEffect, useCallback, useRef } from 'react';
import cn from 'classnames';
import classes from './calculator.module.scss';

const OperationResolver = {
    Add: (a, b) => a + b,
    Substract: (a, b) => a - b,
    Multiple: (a, b) => a * b,
    Divide: (a, b) => a / b,
};

const OperationResolverByKey = {
    '+': OperationResolver.Add,
    '-': OperationResolver.Substract,
    '/': OperationResolver.Divide,
    '*': OperationResolver.Multiple,
};

function isValidNumeric(str) {
    const reg = /^[+-]?([1-9]\d*|0)([\.\,]\d+)?(e[+-]?\d+)?$/;
    return reg.test(str);
}

function isValidNumericPart(str) {
    return /^[+-]?$/.test(str)
        || /^[+-]?([1-9]\d*|0)[\.\,]?$/.test(str)
        || /^[+-]?([1-9]\d*|0)([\.\,]\d+)?(e|e[+-]?)?$/.test(str)
}

export const Calculator = () => {
    const [inputValue, setInputValue] = useState('');
    const [action, setAction] = useState(null);

    const inputElement = useRef();

    const checkKeyPress = useCallback(e => {
        const operation = OperationResolverByKey[e.key];

        if (operation && isValidNumeric(inputValue)) {
            e.preventDefault();
            resolveOperation(operation);
        } else if (e.key === 'Enter' || e.key === '=') {
            calcResult();
        }

        inputElement.current.focus();
    });

    useEffect(() => {
        document.addEventListener('keypress', checkKeyPress);

        return () => {
            document.removeEventListener('keypress', checkKeyPress);
        }
    }, [checkKeyPress]);

    function resolveOperation(operation) {
        if (isValidNumeric(inputValue)) {
            const value = !action
                ? Number(inputValue)
                : action.operation(action.value, Number(inputValue));

            setInputValue('');
            setAction({ value, operation });
        }
    }

    function calcResult() {
        if (action && isValidNumeric(inputValue)) {
            const value = action.operation(action.value, Number(inputValue));

            setInputValue(value);
            setAction(null);
        }
    }

    function updateInputValue(value) {
        if (isValidNumericPart(value) || isValidNumeric(value)) {
            setInputValue(value);
        }
    }

    return (
        <div className={cn('box', classes.calculator, { [classes.successInput]: isValidNumeric(inputValue) })}>
            <label htmlFor="calculator-input" className={classes.calculatorLabel}>
                Value:
            </label>

            <input
                autoFocus
                id="calculator-input"
                className={classes.calculatorInput}
                ref={inputElement}
                value={inputValue}
                onChange={e => updateInputValue(e.target.value)}
            />

            <div className={classes.buttonGroup} disabled={!isValidNumeric(inputValue)}>
                <button onClick={() => resolveOperation(OperationResolver.Add)}>+</button>
                <button onClick={() => resolveOperation(OperationResolver.Substract)}>-</button>
                <button onClick={() => resolveOperation(OperationResolver.Multiple)}>*</button>
                <button onClick={() => resolveOperation(OperationResolver.Divide)}>/</button>
                <button onClick={calcResult}>=</button>
            </div>
        </div>
    );
};
