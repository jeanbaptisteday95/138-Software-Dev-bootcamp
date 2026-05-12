// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

// 1. Switch to (or create) the 'bootcamp' database
use("bootcamp");

// 2. Insert documents into the 'students' collection
// Single insert
db.students.insertOne({ name: "John", cohort: "June 2025" });
// Multiple inserts
// db.students.insertMany([
//   { name: "Alice", cohort: "July 2025" },
//   { name: "Bob", cohort: "July 2025" },
//   { name: "Carol", cohort: "June 2025", email: "carol@email.com" },
// ]);

// 3. Find all students
db.students.find();

// // 4. Find students by cohort
// db.students.find({ cohort: "July 2025" });

// // 5. Find one student by name
// db.students.findOne({ name: "Alice" });

// // 5a. Find student by id
// db.students.find({ _id: new ObjectId("682fae20d9fe0a8e045752d9") });

// // 6. Update a student's email
// db.students.updateOne(
//   { name: "John" },
//   { $set: { email: "john@example.com" } }
// );

// // 7. Update many students in a cohort
// db.students.updateMany({ cohort: "July 2025" }, { $set: { graduated: false } });

// // 8. Delete one student
// db.students.deleteOne({ name: "John" });

// // 9. Delete all students in a cohort
// db.students.deleteMany({ cohort: "June 2025" });

// // 10. Count students in a collection
// db.students.countDocuments();

// // 11. Sort students by name
// db.students.find().sort({ name: 1 });

// // 12. Project only name and email fields
// db.students.find({}, { name: 1, email: 1, _id: 0 });

// 13. Drop the students collection (dangerous!)
// db.students.drop();
