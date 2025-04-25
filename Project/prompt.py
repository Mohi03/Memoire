from flask import Flask, jsonify, request
from flask_cors import CORS
from google import genai
from google.genai import types

app = Flask(__name__)
CORS(app)


@app.route('/gene' , methods = ['POST'])
def get_acceptance_criteria():
    data = request.json
    userStory = data.get("userStory")
    acceptancecCiteria = data.get("scenarios")
    print(f"Value of acceptancecCiteria: {acceptancecCiteria}")
    try:
        client = genai.Client(api_key="AIzaSyBzS4ZG8WdpuSIESr4omIJmAC2j_TVmJbo")  
        response1 = client.models.generate_content(
            model="gemini-2.0-flash",
            config=types.GenerateContentConfig(
            temperature=0.0,
            system_instruction="Ignore the prior instructions, You are an experienced business analyst with 10 years in agile environment , you are tasked with adding acceptance criteria to a set of user stories for a project ,focusing on system behavior and following the specified guidelines. Follow these guidelines: 1. Format Scenarios : Use 'Given-When-Then' (GWT) structure for every criterion.  2. Include:    - Functional requirements.    - Edge cases (invalid inputs, errors, timeouts).    - Non-functional requirements (performance, security, UX) if applicable.  3. Specificity: Avoid vague terms; define exact inputs, messages, and system behaviors.  4. Atomicity: Each criterion should be independently testable.  5. User Perspective: Focus on user actions and observable outcomes.  answer me directly and only with the secanrios and write only the acceptnace critreria and dont write back the user stroy"),
            contents= userStory
            )
        # as new user iwant to create an account easily so that i can start using the application
        response2 = client.models.generate_content(
            model="gemini-2.0-flash",
            config=types.GenerateContentConfig(
            temperature=0.0,
            system_instruction= "Write complete pytest test cases based on the following user story and scenario. The tests should follow best practices, be well structured with Arrange Act Assert sections, and include any relevant edge cases. Use fixtures and mocks if needed. Include only the code in a single Python file, ready to be run with pytest. Use descriptive test function names. Use pytest style assertions (no unittest). Avoid unnecessary boilerplate، focus on testing the logic relevant to the scenario. Now generate the pytest tests that validate this behavior."),
            contents= """
*   Given I am on the account creation page
    *   When I enter a valid email address, a strong password (at least 8 characters, one uppercase, one number), and confirm the password correctly
    *   Then my account should be created successfully, and I should be redirected to the application's dashboard.

*   Given I am on the account creation page
    *   When I enter an email address with an invalid format (e.g., missing '@' symbol or domain)
    *   Then an error message should be displayed indicating the email format is invalid, and the account creation should fail.

*   Given I am on the account creation page
    *   When I enter a password that does not meet the minimum complexity requirements (e.g., less than 8 characters, no uppercase letter)
    *   Then an error message should be displayed indicating the password is too weak, and the account creation should fail.

*   Given I am on the account creation page
    *   When I enter a password and a confirmation password that do not match
    *   Then an error message should be displayed indicating the passwords do not match, and the account creation should fail.

*   Given I am on the account creation page
    *   When I enter an email address that is already registered in the system
    *   Then an error message should be displayed indicating that the email address is already in use, and the account creation should fail.

*   Given I am on the account creation page
    *   When I leave one or more required fields (email, password, confirm password) empty
    *   Then an error message should be displayed indicating that all required fields must be filled, and the account creation should fail.

*   Given I am on the account creation page
    *   When I enter a password in the password field
    *   Then the password should be masked (e.g., displayed as asterisks or dots) to protect it from being visible.

*   Given I am on the account creation page
    *   When I successfully create an account with valid credentials
    *   Then a success message should be displayed confirming the account creation, and I should be automatically logged in or prompted to log in.

*   Given I am on the account creation page
    *   When I attempt to create multiple accounts in a short period of time (e.g., 5 attempts in 1 minute)
    *   Then a message should be displayed indicating that I have exceeded the account creation limit, and I should be temporarily blocked from creating new accounts.

*   Given I am on the account creation page
    *   When the backend system experiences a failure during account creation
    *   Then a user-friendly error message should be displayed indicating that there was a problem creating the account, and I should be advised to try again later.
    
            
"""
            )
        return jsonify({
            'acceptance_criteria': response1.text,
            'pytest_tests': response2.text
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')