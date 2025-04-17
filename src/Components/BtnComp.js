import React from 'react'

function BtnComp({
    title,
    onClick,
    bgColor,
    color,
    width,
    height,
    bgHover,
    rounded,
    type,
    border,
    shadow,
    disabled
  }) {
  
   const roundedBtn = rounded || 'rounded-md'
   const colorBtn = color || 'text-white'
   const widthBtn = width || 'w-full'
   const hoverBtn = bgHover || 'bg-blue-900'
   const bgBtn = bgColor || 'bg-blue-900'
   const borderBtn = border || ''
   const typeBtn = type || 'button'
   const shadowBtn = shadow || ''
    const cls = `inline-flex items-center ${shadowBtn} justify-center ${roundedBtn} ${bgBtn} p-2.5 text-sm font-medium ${colorBtn} hover:${hoverBtn}  ${borderBtn}   ${widthBtn}   dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800  active:scale-95 duration-300`
    return (
      <button
        type={typeBtn}
        class={cls}
        onClick={() => onClick()}
        disabled ={disabled}
      >
        {title}
      </button>
    );
  }

export default BtnComp
