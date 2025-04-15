import {
  IconEye,
  IconCopy,
  IconTrash,
} from '@tabler/icons-react'
export const clientTypes = new Map([
  ['Active', 'bg-green-100/40 text-green-800 dark:text-green-200 border-green-300'],
  ['Inactive', 'bg-neutral-300/40 text-neutral-700 dark:text-neutral-200 border-neutral-300'],
])



export const clientActions = [
  {
    label: 'View',
    value: 'view',
    icon: IconEye,
  },
  {
    label: 'Copy',
    value: 'copy',
    icon: IconCopy,
  },
  {
    label: 'Delete',
    value: 'delete',
    icon: IconTrash,
  },
]
