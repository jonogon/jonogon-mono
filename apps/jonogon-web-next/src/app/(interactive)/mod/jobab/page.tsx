import JobabList from "../../_components/JobabList";

export default function JobabAdminPage() {
  return (
    <div className="p-8 overflow-auto">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">
          Jobabs
        </h1>
        <div className="space-y-4 space-x-4">
          <JobabList />
        </div>
      </div>
    </div>
  )
 }
