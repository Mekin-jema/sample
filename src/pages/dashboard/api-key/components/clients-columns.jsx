import LongText from '@/pages/dashboard/long-text'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'
import { clientTypes, clientActions } from '../data/data'

import { DataTableColumnHeader } from './data-table-column-header'
// import { DataTableRowActions } from './data-table-row-actions'

export const columns = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    meta: {
      className: cn(
        'sticky md:table-cell left-0 z-10 rounded-tl',
        ' transition-colors duration-200 group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted',
      ),
    },
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'apiKey',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="API Key" />
    ),
    cell: ({ row }) => (
      <div className="font-sora text-sm">{row.getValue('apiKey')}</div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'user',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="User" />
    ),
    cell: ({ row }) => (
      <LongText className="max-w-36">{row.getValue('user')}</LongText>
    ),
    enableHiding: false,
  },
  {
    accessorKey: 'realm',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Realm" />
    ),
    cell: ({ row }) => <div>{row.getValue('realm')}</div>,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue('status')
      const badgeColor = clientTypes.get(status)
      return (
        <div className="flex space-x-2">
          <Badge variant="outline" className={cn('capitalize', badgeColor)}>
            {status}
          </Badge>
        </div>
      )
    },
    filterFn: 'weakEquals',
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created" />
    ),
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.getValue('createdAt')}
      </span>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'actions',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Actions" />
    ),
    cell: ({ row }) => {
      const { actions } = row.original

      return (
        <div className="flex gap-2">
          {actions.map((actionKey) => {
            const action = clientActions.find((a) => a.value === actionKey)
            if (!action) return null
            return (
              <action.icon
                key={action.value}
                size={16}
                className="text-muted-foreground hover:text-primary cursor-pointer"
              />
            )
          })}
        </div>
      )
    },
    enableSorting: false,
    enableHiding: false,
  },
  // {
  //   id: 'row-actions',
  //   cell: DataTableRowActions,
  // },
]
