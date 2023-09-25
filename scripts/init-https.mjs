import { execSync } from "child_process";
import ora from "ora";
import inquirer from "inquirer";

const questions = [
  {
    type: "input",
    name: "C",
    message: "Country Name (2 letter code): ",
    default: "US",
  },
  {
    type: "input",
    name: "ST",
    message: "State or Province Name: ",
    default: "California",
  },
  {
    type: "input",
    name: "L",
    message: "Locality Name (e.g. city): ",
    default: "San Francisco",
  },
  {
    type: "input",
    name: "O",
    message: "Organization Name (e.g. company): ",
    default: "MyCompany Inc.",
  },
  {
    type: "input",
    name: "OU",
    message: "Organizational Unit Name (e.g. section): ",
    default: "Tech Division",
  },
  {
    type: "input",
    name: "CN",
    message: "Common Name (e.g. server FQDN or YOUR name): ",
    default: "www.mycompany.com",
  },
  {
    type: "input",
    name: "emailAddress",
    message: "Email Address: ",
    default: "admin@mycompany.com",
  },
];

const main = async () => {
  const answers = await inquirer.prompt(questions);
  const subj = Object.entries(answers)
    .map(([key, value]) => `/${key}=${value}`)
    .join("");

  const spinner = ora("Generating SSL certificate... 🚀").start();
  try {
    execSync(
      `openssl req -x509 -newkey rsa:4096 -nodes -keyout https.key -out https.crt -days 365 -subj "${subj}"`
    );
    spinner.succeed("Certificate generated successfully! 🎉");

    spinner.start("Copying key and certificate to packages/server...");
    execSync("cp https.key https.crt packages/server/");
    spinner.succeed("Key and certificate copied successfully! 🚚");
  } catch (error) {
    spinner.fail("An error occurred 😞");
    console.error(error);
  }
};

main();
