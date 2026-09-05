import { facultyService } from "@/services/faculty.service";

export default async function AdminFacultyDetailPage({ params }: { params: { id: string } }) {
  const member = await facultyService.getById(params.id);
  return (
    <div>
      <h1>{member.firstName} {member.lastName}</h1>
      <p>Employee ID: {member.employeeId}</p>
      <p>Designation: {member.designation}</p>
      <p>Status: {member.status}</p>
    </div>
  );
}
