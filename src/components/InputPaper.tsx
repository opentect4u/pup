import React from 'react'
import { KeyboardTypeOptions } from 'react-native'
import { TextInput } from "react-native-paper"
import { usePaperColorScheme } from '../theme/theme'

type InputPaperProps = {
    label: string
    value: string | number
    onChangeText: (msg: string | number) => void
    onBlur?: () => void
    secureTextEntry?: boolean
    keyboardType?: KeyboardTypeOptions
    customStyle?: {}
    leftIcon?: string
    autoFocus?: boolean
    mode?: "outlined" | "flat"
    maxLength?: number
    selectTextOnFocus?: boolean
    disabled?: boolean
    clearTextOnFocus?: boolean
    hideUnderline?: boolean
    multiline?: boolean
    onFocus?: () => void
    onKeyPress?: () => void
    onPressRight?: () => void
    password?: boolean
    underlineColor?: string
    error?: boolean
}

const InputPaper = ({
    label,
    value,
    onChangeText,
    onBlur,
    secureTextEntry,
    keyboardType,
    customStyle,
    leftIcon,
    autoFocus,
    mode = "flat",
    maxLength = 100,
    selectTextOnFocus,
    disabled,
    clearTextOnFocus,
    multiline,
    hideUnderline = false,
    onFocus,
    onKeyPress,
    onPressRight,
    password = false,
    underlineColor,
    error = false
}: InputPaperProps) => {
    const theme = usePaperColorScheme()
    return (
        <TextInput
            error={error}
            onKeyPress={onKeyPress}
            onFocus={onFocus}
            selectTextOnFocus={selectTextOnFocus}
            mode={mode}
            keyboardType={keyboardType}
            label={label}
            value={value?.toString()}
            onChangeText={onChangeText}
            onBlur={onBlur}
            secureTextEntry={secureTextEntry}
            style={customStyle}
            left={leftIcon && <TextInput.Icon icon={leftIcon} />}
            right={password && <TextInput.Icon icon={secureTextEntry ? "eye" : "eye-off"} onPress={onPressRight} />}
            autoFocus={autoFocus}
            maxLength={maxLength}
            multiline={multiline}
            underlineColor={underlineColor || theme.colors.secondary}
            disabled={disabled}
            clearTextOnFocus={clearTextOnFocus}
            underlineStyle={{
                display: !hideUnderline ? "flex" : "none"
            }}
        />
    )
}

export default InputPaper