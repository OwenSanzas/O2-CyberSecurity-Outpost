interface Props {
  isInList: boolean
  onToggle: () => void
  size?: 'sm' | 'md'
}

export default function ReadingListButton({ isInList, onToggle, size = 'sm' }: Props) {
  return (
    <button
      onClick={e => { e.stopPropagation(); onToggle() }}
      className="transition-all cursor-pointer border-none bg-transparent"
      title={isInList ? 'Remove from reading list' : 'Add to reading list'}
      style={{ fontSize: size === 'sm' ? '14px' : '18px' }}
    >
      <span style={{
        filter: isInList ? 'none' : 'grayscale(1) opacity(0.4)',
        transition: 'all 0.2s',
      }}>
        {isInList ? '🔖' : '📑'}
      </span>
    </button>
  )
}
