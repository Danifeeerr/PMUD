function removeStudents(...students)
{
    return students.concat("Jane", "George").filter(s => s !== "John").sort().slice(2);
}

console.log(removeStudents("John", "Mary", "Frank", "Nicole", "Joseph"));