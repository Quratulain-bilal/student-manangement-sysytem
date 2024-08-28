import chalk from "chalk";
import inquirer from "inquirer";



let myBalance = 0;
let continueEnrollment = true;
let studentCourses :{[key:string]:any} = {};
let studentIntro:{[key:string]:any} = {};
let studentKey;
// Using loop for continuous enrollment
while (continueEnrollment) {
  

  // Step 1: Ask for student name and ID, ensure unique ID
  while (true) {
    let answer = await inquirer.prompt([
      {
        name: "student",
        type: "input",
        message: chalk.bold.greenBright("Enter student name"),
        validate: function (value) {
          return value.trim() !== ""
            ? true
            : chalk.bold.blue("Please enter a valid name");
        },
      },
      {
        name: "studentID",
        type: "input",
        message: "Enter your ID",
        validate: function (value) {
          return value.trim() !== "" ? true : "Please enter a valid ID";
        },
      },
    ]);

    studentKey = `${answer.studentID}`;

    if (!studentIntro[studentKey]) {
      studentIntro[studentKey] = { name: answer.student, courses: [] };
      break;
    } else {
      console.log(
        `Student with ID ${answer.studentID} already exists. Please enter a different ID.`
      );
    }
  }

  // Step 2: Initialize student's course list if not already present
  if (!studentCourses[studentKey]) {
    studentCourses[studentKey] = [];
  }

  while (true) {
    // Step 3: Ask for the course to enroll
    let courseAnswer = await inquirer.prompt([
      {
        name: "courses",
        type: "list",
        message: chalk.bold.greenBright("Select the course to enroll"),
        choices: ["javascript", "typescript", "java", "html"],
      },
    ]);

    // Step 4: Check if the student is already enrolled in the selected course
    if (studentCourses[studentKey].includes(courseAnswer.courses)) {
      console.log(
        `You are already enrolled in ${courseAnswer.courses}. Please select a different course.`
      );
      continue;
    }

    // Step 5: Define the tuition fees for each course
    const tuitionFees :{[key:string]:any}= {
      javascript: 3000,
      typescript: 6000,
      java: 2000,
      html: 7000,
    };

    // Step 6: Display the tuition fee for the selected course
    console.log(
      chalk.bold.blue(
        `Your tuition fee is ${chalk.bold.green(
          tuitionFees[courseAnswer.courses]
        )}`
      )
    );
    console.log(chalk.bold.blue(`Your balance is ${myBalance}`));

    // Step 7: Ask for payment method and amount
    const paymentType = await inquirer.prompt([
      {
        name: "payment",
        type: "list",
        message: chalk.bold.green("Select payment method"),
        choices: ["easypaisa", "jazzcash", "banktransfer"],
      },
      {
        name: "amount",
        type: "input",
        message: chalk.bold.green("Transfer money"),
        validate: function (value) {
          return !isNaN(value) && parseFloat(value) > 0
            ? true
            : chalk.bold.green("Please enter a valid amount");
        },
      },
    ]);

    // Step 8: Display selected payment method
    console.log(
      chalk.bold.blue(
        `You selected payment method ${chalk.bold.green(paymentType.payment)}`
      )
    );

    // Step 9: Calculate and compare payment amount with tuition fee
    let tuitionFee = tuitionFees[courseAnswer.courses];
    let paymentAmount = parseFloat(paymentType.amount);

    if (paymentAmount === tuitionFee) {
      console.log(
        chalk.bold.blue(
          `Congratulations, you have successfully enrolled in ${courseAnswer.courses}`
        )
      );

      // Update balance and student's enrolled courses
      myBalance += paymentAmount;
      studentCourses[studentKey].push(courseAnswer.courses);
    } else if (paymentAmount > tuitionFee) {
      // Handle overpayment
      console.log(
        chalk.bold.blue(
          "Payment amount exceeds tuition fees. Please transfer the exact amount."
        )
      );
      continue;
    } else {
      console.log(
        chalk.bold.blue("Insufficient payment. Please make the full payment.")
      );
      continue;
    }

    // Ask if the user wants to enroll in more courses
    const moreCoursesResponse = await inquirer.prompt([
      {
        name: "moreCourses",
        type: "confirm",
        message: "Do you want to enroll in more courses?",
      },
    ]);

    if (!moreCoursesResponse.moreCourses) {
      break;
    }
  }

  // Step 10: Ask what to do next
  const ask = await inquirer.prompt({
    name: "select",
    type: "list",
    message: "What would you like to do next?",
    choices: ["exit", "viewstatus"],
  });

  if (ask.select === "viewstatus") {
    // Display student's status
    console.log(chalk.bold.blue("\n******* Status *******"));
    console.log(
      chalk.bold.blue(
        `Student name: ${chalk.bold.green(studentIntro[studentKey].name)}`
      )
    );
    console.log(chalk.bold.blue("Courses enrolled:"));
    console.log(chalk.bold.green(studentCourses[studentKey].join(", ")));
    console.log(chalk.bold.blue(`Balance: ${chalk.bold.green(myBalance)}`));
  } else {
    console.log("Exit student management system");
  }

  // Step 11: Ask if the user wants to continue enrolling
  const continueResponse = await inquirer.prompt([
    {
      name: "continue",
      type: "confirm",
      message: chalk.bold.blue("Do you want to continue enrolling in courses?"),
    },
  ]);

  continueEnrollment = continueResponse.continue;
}
