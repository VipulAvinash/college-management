import { studentService } from "@/services/student.service";
import { feeService } from "@/services/fee.service";

export default async function AdminStudentDetailPage({ params }: { params: { id: string } }) {
  const student = await studentService.getById(params.id);
  const fees = await feeService.getByStudent(params.id);

  return (
    <div>
      <h1>{student.firstName} {student.lastName}</h1>
      <p>Student ID: {student.studentId}</p>
      <p>Email: {student.email}</p>
      <p>Status: {student.status}</p>
      <h2>Fee Records</h2>
      <ul>
        {fees.map((f) => (
          <li key={f.id}>{f.academicYear}: paid {f.paidAmount} / total {f.totalAmount} ({f.status})</li>
        ))}
      </ul>
    </div>
  );
}
