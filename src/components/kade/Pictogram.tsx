import { pictograms, type PictogramId } from '@/assets/pictograms'
import { cn } from '@/lib/utils'

export function Pictogram({
  id,
  className,
  alt = '',
}: {
  id: PictogramId
  className?: string
  alt?: string
}) {
  return (
    <img
      src={pictograms[id]}
      alt={alt}
      className={cn('h-10 w-10 object-contain', className)}
      draggable={false}
    />
  )
}
