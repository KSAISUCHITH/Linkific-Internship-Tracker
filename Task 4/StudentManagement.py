def write_log(message):
    with open("logs.txt", "a") as file:
        file.write(message + "\n")



class Person:

    def __init__(self, name, age):
        self.name = name
        self.age = age



class Student(Person):

    def __init__(self, student_id, name, age, course):
        super().__init__(name, age)
        self.student_id = student_id
        self.course = course

    def display(self):
        print("ID:", self.student_id)
        print("Name:", self.name)
        print("Age:", self.age)
        print("Course:", self.course)


class StudentManagementSystem:

    def __init__(self):
        self.students = {}

    def add_student(self):

        try:
            student_id = int(input("Enter Student ID: "))
            name = input("Enter Name: ")
            age = int(input("Enter Age: "))
            course = input("Enter Course: ")

            student = Student(student_id, name, age, course)

            self.students[student_id] = student

            write_log("Added student: " + name)

            print("Student added successfully!")

        except ValueError:
            print("Please enter valid details.")

    def view_students(self):

        if len(self.students) == 0:
            print("No students found.")
            return

        for student in self.students.values():
            student.display()
            print("----------------")

    def search_student(self):

        try:
            student_id = int(input("Enter Student ID: "))

            if student_id in self.students:
                self.students[student_id].display()
            else:
                print("Student not found.")

        except ValueError:
            print("Please enter a valid ID.")

    def delete_student(self):

        try:
            student_id = int(input("Enter Student ID: "))

            if student_id in self.students:
                del self.students[student_id]

                write_log("Deleted student: " + str(student_id))

                print("Student deleted successfully!")

            else:
                print("Student not found.")

        except ValueError:
            print("Please enter a valid ID.")

    def run(self):

        while True:

            print("\n===== Student Management System =====")
            print("1. Add Student")
            print("2. View Students")
            print("3. Search Student")
            print("4. Delete Student")
            print("5. Exit")

            choice = input("Enter your choice: ")

            if choice == "1":
                self.add_student()

            elif choice == "2":
                self.view_students()

            elif choice == "3":
                self.search_student()

            elif choice == "4":
                self.delete_student()

            elif choice == "5":
                write_log("Application closed")
                print("Goodbye!")
                break

            else:
                print("Invalid choice.")


system = StudentManagementSystem()
system.run()