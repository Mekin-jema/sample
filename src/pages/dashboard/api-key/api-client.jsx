import { IconMailPlus, IconUserPlus } from "@tabler/icons-react";
import { Link, Outlet, useLoaderData, useSearchParams } from "react-router";

import { columns } from "./components/clients-columns"; // updated
// import { ClientsTable } from './components/clients-table' // updated

import {
  FilterSchema,
  PaginationSchema,
  QuerySchema,
  SortSchema,
} from "./hooks/use-data-table-state";

import { Main } from "@/pages/dashboard/main";
import { Header } from "@/pages/dashboard/navbar/main-header";
import { Search } from "@/pages/dashboard/navbar/search";
import { DarkModeToggle } from "@/pages/dashboard/navbar/toggle-theme";
import { NavUser } from "@/pages/dashboard/navbar/header-user";
import { Button } from "@/components/ui/button";
import { UsersTable } from "./components/clients-table";
import {
  getFacetedClientCounts,
  listFilteredClients,
} from "./data/queries.server";

export const Loader = ({ request }) => {
  const searchParams = new URLSearchParams(new URL(request.url).searchParams);

  const { user } = QuerySchema.parse({
    username: searchParams.get("username") || "",
  });

  const { ...filters } = FilterSchema.parse({
    status: searchParams.getAll("status"),
    realm: searchParams.getAll("realm"),
  });

  const { sort_by: sortBy, sort_order: sortOrder } = SortSchema.parse({
    sort_by: searchParams.get("sort_by"),
    sort_order: searchParams.get("sort_order"),
  });

  const { page: currentPage, per_page: pageSize } = PaginationSchema.parse({
    page: searchParams.get("page"),
    per_page: searchParams.get("per_page"),
  });

  const { pagination, data: clients } = listFilteredClients({
    user,
    filters,
    currentPage,
    pageSize,
    sortBy,
    sortOrder,
  });

  const facetedCounts = getFacetedClientCounts({
    facets: ["status", "realm"],
    user,
    filters,
  });

  return { clients, pagination, facetedCounts };
};

export default function ClientsPage() {
  const { clients, pagination, facetedCounts } = useLoaderData();
  const [searchParams] = useSearchParams();

  return (
    <>
      <Header>
        <div className="ml-auto flex items-center space-x-4">
          <Search />
          <DarkModeToggle />
          {/* <NavUser /> */}
        </div>
      </Header>

      <Main>
        <div className="mb-2 flex flex-wrap items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">API Clients</h2>
            <p className="text-muted-foreground">
              Manage your API clients and their configurations.
            </p>
          </div>
          <div className="flex gap-2">
            <Button className="space-x-1" variant="outline" asChild>
              <Link to={`/dashboard/api-keys/add?${searchParams.toString()}`}>
                <span>Add Client</span> <IconUserPlus size={18} />
              </Link>
            </Button>
          </div>
        </div>

        <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12">
          <UsersTable
            data={clients}
            columns={columns}
            pagination={pagination}
            facetedCounts={facetedCounts}
          />
        </div>

        <Outlet />
      </Main>
    </>
  );
}
