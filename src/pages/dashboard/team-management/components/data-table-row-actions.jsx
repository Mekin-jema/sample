import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { Link, useSearchParams } from "react-router";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function DataTableRowActions({ row }) {
  const [searchParams] = useSearchParams();
  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className=" flex h-8 w-8 p-0">
            <DotsHorizontalIcon className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-[160px] bg-[#D19EDB] text-black"
        >
          <DropdownMenuItem asChild className="hover:cursor-pointer">
            <Link
              to={`/dashboard/users/${
                row.original.id
              }/update?${searchParams.toString()}`}
            >
              Edit
              <DropdownMenuShortcut>
                <IconEdit size={16} color="green" />
              </DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild className="hover:cursor-pointer">
            <Link
              to={`/dashboard/users/${
                row.original.id
              }/delete?${searchParams.toString()}`}
            >
              Delete
              <DropdownMenuShortcut>
                <IconTrash size={16} color="red" />
              </DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
