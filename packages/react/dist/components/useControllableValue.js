import { useCallback, useState } from "react";
export function useControllableValue(value, defaultValue, onChange) {
    const [internalValue, setInternalValue] = useState(defaultValue);
    const isControlled = value !== undefined;
    const currentValue = isControlled ? value : internalValue;
    const setValue = useCallback((nextValue) => {
        if (Object.is(currentValue, nextValue)) {
            return;
        }
        if (!isControlled) {
            setInternalValue(nextValue);
        }
        onChange?.(nextValue, currentValue);
    }, [currentValue, isControlled, onChange]);
    return [currentValue, setValue];
}
//# sourceMappingURL=useControllableValue.js.map