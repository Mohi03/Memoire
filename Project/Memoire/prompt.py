from flask import Flask, jsonify, request
from flask_cors import CORS
from google import genai
from google.genai import types

app = Flask(__name__)
CORS(app)


@app.route('/gene', methods=['POST'])
def get_acceptance_criteria():
    data = request.json
    userStory = data.get("userStory")
    scenarios = data.get("scenarios", [])  # Default to empty list if not provided
    
    try:
        client = genai.Client(api_key="AIzaSyBzS4ZG8WdpuSIESr4omIJmAC2j_TVmJbo")  
        
        # If scenarios is empty, generate acceptance criteria
        if not scenarios:
            response = client.models.generate_content(
                model="gemini-2.0-flash",
                config=types.GenerateContentConfig(
                    temperature=0.0,
                    system_instruction="Ignore the prior instructions, You are an experienced business analyst with 10 years in agile environment , you are tasked with adding acceptance criteria to a set of user stories for a project ,focusing on system behavior and following the specified guidelines. Follow these guidelines: 1. Format Scenarios : Use 'Given-When-Then' (GWT) structure for every criterion.  2. Include:    - Functional requirements.    - Edge cases (invalid inputs, errors, timeouts).    - Non-functional requirements (performance, security, UX) if applicable.  3. Specificity: Avoid vague terms; define exact inputs, messages, and system behaviors.  4. Atomicity: Each criterion should be independently testable.  5. User Perspective: Focus on user actions and observable outcomes.  answer me directly and only with the secanrios and write only the acceptnace critreria and dont write back the user stroy"),
                contents=userStory
            )
            return jsonify({
                'acceptance_criteria': response.text
            })
        
        # If scenarios are provided, generate test cases
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            config=types.GenerateContentConfig(
                temperature=0.0,
                system_instruction="Write complete pytest test cases based on the following user story and scenario. The tests should follow best practices, be well structured with Arrange Act Assert sections, and include any relevant edge cases. Use fixtures and mocks if needed. Include only the code in a single Python file, ready to be run with pytest. Use descriptive test function names. Use pytest style assertions (no unittest). Avoid unnecessary boilerplate، focus on testing the logic relevant to the scenario. Now generate the pytest tests that validate this behavior."),
            contents=scenarios
        )
        return jsonify({
            'pytest_tests': response.text
        })
        
    except Exception as e:
        print(f"Error: {str(e)}")  # Add error logging
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')