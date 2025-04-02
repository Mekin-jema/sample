import {
  Table,
  TableCaption,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  TableFooter,
} from "@/components/ui/table";

const recentRequests = [
  {
    timestamp: "2024-10-20 10:15 AM",
    type: "Geocoding",
    status: "Success",
    responseTime: "120ms",
  },
  {
    timestamp: "2024-10-20 10:20 AM",
    type: "Routing",
    status: "Failed",
    responseTime: "300ms",
  },
  {
    timestamp: "2024-10-20 10:25 AM",
    type: "Directions",
    status: "Success",
    responseTime: "98ms",
  },
  {
    timestamp: "2024-10-20 10:30 AM",
    type: "Matrix",
    status: "Success",
    responseTime: "150ms",
  },
];

export function RecentAPIRequestsTable() {
  return (
    <div className="p-6  rounded-2xl shadow-lg   ">
      <h2 className="text-2xl font-bold mb-4">Recent API Requests</h2>
      <Table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
        <TableCaption className="text-gray-500 italic p-4">
          A summary of the most recent API interactions.
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[180px] p-3 border-b text-left">
              Timestamp
            </TableHead>
            <TableHead className="p-3 border-b text-left">
              Request Type
            </TableHead>
            <TableHead className="p-3 border-b text-left">Status</TableHead>
            <TableHead className="p-3 border-b text-right">
              Response Time
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recentRequests.map((request, index) => (
            <TableRow
              key={index}
              className="hover:bg-gray-50 transition-colors hover:text-black"
            >
              <TableCell className="p-3 border-b text-left">
                {request.timestamp}
              </TableCell>
              <TableCell className="p-3 border-b text-left">
                {request.type}
              </TableCell>
              <TableCell className="p-3 border-b text-left">
                <span
                  className={`px-2 py-1 rounded-full text-sm font-medium ${
                    request.status === "Success"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {request.status}
                </span>
              </TableCell>
              <TableCell className="p-3 border-b text-right">
                {request.responseTime}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3} className="p-3 font-semibold text-left">
              Total Requests
            </TableCell>
            <TableCell className="p-3 text-right font-semibold">
              {recentRequests.length}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
