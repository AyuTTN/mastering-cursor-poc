type SwapButtonProps = {
  onClick: () => void
  disabled?: boolean
  'aria-label'?: string
}

export function SwapButton({
  onClick,
  disabled = false,
  'aria-label': ariaLabel = 'Swap currencies',
}: SwapButtonProps) {
  return (
    <button
      type="button"
      className="swap-button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      ↔︎
    </button>
  )
}
