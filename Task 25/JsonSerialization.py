import json

applications = [
    {
        "application_id": 101,
        "candidate": "K Sai Suchith",
        "job": "Frontend Developer Intern",
        "status": "Applied"
    },
    {
        "application_id": 102,
        "candidate": "Rahul",
        "job": "Python Backend Intern",
        "status": "Shortlisted"
    },
    {
        "application_id": 103,
        "candidate": "Ananya",
        "job": "Data Science Intern",
        "status": "Under Review"
    }
]

json_data = json.dumps(applications, indent=4)

print("Serialized JSON:")
print(json_data)

with open("applications.json", "w") as file:
    json.dump(applications, file, indent=4)

print("\nData saved to applications.json")

with open("applications.json", "r") as file:
    loaded_applications = json.load(file)

print("\nDeserialized Python Data:")
print(loaded_applications)

print("\nApplication Details:")

for application in loaded_applications:
    print(f"Application ID: {application['application_id']}")
    print(f"Candidate: {application['candidate']}")
    print(f"Job: {application['job']}")
    print(f"Status: {application['status']}")
    print("-" * 30)