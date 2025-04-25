document.addEventListener('DOMContentLoaded', function() {

    const userStoryInput = document.getElementById('userStory');
    const generateBtn = document.getElementById('generateBtn');
    const scenariosSection = document.getElementById('scenariosSection');
    const scenarioList = document.getElementById('scenarioList');
    const addScenarioBtn = document.getElementById('addScenarioBtn');
    const confirmScenariosBtn = document.getElementById('confirmScenariosBtn');
    const resultsSection = document.getElementById('resultsSection');
    const outputDiv = document.getElementById('results');
    const copyResultsBtn = document.getElementById('copyResultsBtn');
    const copyStatus = document.getElementById('copyStatus');
    const startOverBtn = document.getElementById('startOverBtn');
    const userStoryError = document.getElementById('userStoryError');
    

    function isUserStory(text) {
        const lowerText = text.toLowerCase().trim();
        const keywords = ["as a", "i want to", "so that"];
        const startsWithAsA = lowerText.startsWith("as a ");
        const containsIWantTo = lowerText.includes("i want to ");
        const containsSoThat = lowerText.includes("so that ");
      
        if (startsWithAsA && containsIWantTo && containsSoThat) {
          return true;
        }

        if (startsWithAsA && containsIWantTo) {
          return true;
        }

        if (containsIWantTo && containsSoThat) {
          return true;
        }
        const commonStarts = ["as", "i want", "want to"];
        if (commonStarts.some(start => lowerText.startsWith(start))) {
          const parts = lowerText.split(/\s+/); // Split by whitespace
          if (parts.length >= 3 && (parts.includes("want") || lowerText.includes("want to"))) {
            return true;
          }
        }
      
        return false;
      }
      


    generateBtn.addEventListener('click', function() {
        const userStory = userStoryInput.value.trim();
        
        if (!isUserStory(userStory)) {
            userStoryError.classList.remove('hidden');
            return;
        }
        
        userStoryError.classList.add('hidden');
        generateGWTScenarios(userStory);
        scenariosSection.classList.remove('hidden');
    
            
    });

    // As a bank customer I want to withdraw money from an ATM So that I’m not constrained by opening hours or lines at the teller’s
    addScenarioBtn.addEventListener('click', function() {
        addGWTScenario('', true);
    });

    
    confirmScenariosBtn.addEventListener('click', function() {
        const scenarios = [];
        const scenarioElements = scenarioList.querySelectorAll('.scenario-item');
        
        scenarioElements.forEach(item => {
            const given = item.querySelector('.given-textarea').value.trim();
            
            if (given) {
                scenarios.push({
                    given: given,
                });
            }
        });
        
        if (scenarios.length === 0) {
            alert('Please add at least one scenario');
            return;
        }
        
        const userStory = userStoryInput.value.trim();
        generateGWTScenarios(userStory, scenarios);
        scenariosSection.classList.add('hidden');
        resultsSection.classList.remove('hidden');
    });

    
    copyResultsBtn.addEventListener('click', function() {
        navigator.clipboard.writeText(outputDiv.textContent)
            .then(() => {
                copyStatus.classList.remove('hidden');
                setTimeout(() => copyStatus.classList.add('hidden'), 2000);
            });
    });

    
    startOverBtn.addEventListener('click', function() {
        userStoryInput.value = '';
        scenarioList.innerHTML = '';
        outputDiv.textContent = '';
        resultsSection.classList.add('hidden');
        scenariosSection.classList.add('hidden');
        window.scrollTo(0, 0);
    });

    function generateGWTScenarios(userStory, scenarios) {
        scenarioList.innerHTML = '';
        
        const parts = userStory.match(/As a (.*?), I want (.*?) so that (.*?)/i) || [];
        
        fetch('http://127.0.0.1:5000/gene', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({"userStory":userStory ,
                                 "scenarios" :scenarios
             }),
          })
        .then(response => response.json())
        .then(data => {
            if (data.acceptance_criteria) {

                const scenarios = data.acceptance_criteria.split(/(?=\*\*Scenario \d+:)/).filter(scenario => scenario.trim() !== "");

                scenarios.forEach(scenario => {
                    const titleMatch = scenario.match(/\*\*Scenario \d+:\s*(.*?)\*\*/);
                    if (titleMatch && titleMatch[1]) {
                      const title = titleMatch[1].trim();
                      const line = scenario.replace(titleMatch[0], '').trim();
                      addGWTScenario(line, title);

                    }
                  });

            } else if (data.error) {
                // error mangem
            }
            if (data.pytest_tests) {
                outputDiv.textContent = data.pytest_tests;
            }


        })
        .catch(error => {
            // error catch
        }); 
    
    }

  
    function addGWTScenario(given, title) {
        const scenarioId = Date.now();
        const scenarioItem = document.createElement('div');
        scenarioItem.className = 'scenario-item';
        scenarioItem.dataset.id = scenarioId;
        
        scenarioItem.innerHTML = `
            <div class="scenario-header">
                <div class="scenario-title">Scenario ${title}</div>
                <button class="btn btn-danger btn-sm remove-btn" data-id="${scenarioId}">Remove</button>
            </div>
            
            <div class="gwt-section given-section">
                <label class="gwt-label"></label>
                <textarea class="given-textarea" placeholder="Initial context and preconditions...">${given}</textarea>
            </div>

        `;
        
        scenarioList.appendChild(scenarioItem);
        
        
        scenarioItem.querySelector('.remove-btn').addEventListener('click', function() {
            if (confirm('Are you sure you want to remove this scenario?')) {
                scenarioItem.remove();
            }
        });
    }

 
    function generateGWTTests(scenarios) {
        let output = `\n\n`;
        
        output += `Scenarios in Given-When-Then format:\n\n`;
        scenarios.forEach((scenario, index) => {
        output += `Scenario ${index + 1}:\n`;

        });
    
    }
});