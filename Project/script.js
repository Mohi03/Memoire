document.addEventListener('DOMContentLoaded', function() {

    const userStoryInput = document.getElementById('userStory');
    const generateBtn = document.getElementById('generateBtn');
    const scenariosSection = document.getElementById('scenariosSection');
    const scenarioList = document.getElementById('scenarioList');
    const addScenarioBtn = document.getElementById('addScenarioBtn');
    const confirmScenariosBtn = document.getElementById('confirmScenariosBtn');
    const resultsSection = document.getElementById('resultsSection');
    const resultsDiv = document.getElementById('results');
    const copyResultsBtn = document.getElementById('copyResultsBtn');
    const copyStatus = document.getElementById('copyStatus');
    const startOverBtn = document.getElementById('startOverBtn');
    const userStoryError = document.getElementById('userStoryError');


    generateBtn.addEventListener('click', function() {
        const userStory = userStoryInput.value.trim();
        
        if (!userStory) {
            userStoryError.classList.remove('hidden');
            return;
        }
        
        userStoryError.classList.add('hidden');
        generateGWTScenarios(userStory);
        scenariosSection.classList.remove('hidden');
    });

    
    addScenarioBtn.addEventListener('click', function() {
        addGWTScenario('', '', '', true);
    });

    
    confirmScenariosBtn.addEventListener('click', function() {
        const scenarios = [];
        const scenarioElements = scenarioList.querySelectorAll('.scenario-item');
        
        scenarioElements.forEach(item => {
            const given = item.querySelector('.given-textarea').value.trim();
            const when = item.querySelector('.when-textarea').value.trim();
            const then = item.querySelector('.then-textarea').value.trim();
            
            if (given || when || then) {
                scenarios.push({
                    given: given,
                    when: when,
                    then: then
                });
            }
        });
        
        if (scenarios.length === 0) {
            alert('Please add at least one scenario');
            return;
        }
        
        generateGWTTests(userStoryInput.value.trim(), scenarios);
        scenariosSection.classList.add('hidden');
        resultsSection.classList.remove('hidden');
    });

    
    copyResultsBtn.addEventListener('click', function() {
        navigator.clipboard.writeText(resultsDiv.textContent)
            .then(() => {
                copyStatus.classList.remove('hidden');
                setTimeout(() => copyStatus.classList.add('hidden'), 2000);
            });
    });

    
    startOverBtn.addEventListener('click', function() {
        userStoryInput.value = '';
        scenarioList.innerHTML = '';
        resultsDiv.textContent = '';
        resultsSection.classList.add('hidden');
        scenariosSection.classList.add('hidden');
        window.scrollTo(0, 0);
    });

    function generateGWTScenarios(userStory) {
        scenarioList.innerHTML = '';
        
        const parts = userStory.match(/As a (.*?), I want (.*?) so that (.*?)/i) || [];
        
        addGWTScenario(
            ``,
            ``,
            ``
        );
        
        addGWTScenario(
            ``,
            ``,
            ``
        );
        
    }

  
    function addGWTScenario(given, when, then, isNew = false) {
        const scenarioId = Date.now();
        const scenarioItem = document.createElement('div');
        scenarioItem.className = 'scenario-item';
        scenarioItem.dataset.id = scenarioId;
        
        scenarioItem.innerHTML = `
            <div class="scenario-header">
                <div class="scenario-title">Scenario ${isNew ? '(New)' : ''}</div>
                <button class="btn btn-danger btn-sm remove-btn" data-id="${scenarioId}">Remove</button>
            </div>
            
            <div class="gwt-section given-section">
                <label class="gwt-label">Given</label>
                <textarea class="given-textarea" placeholder="Initial context and preconditions...">${given}</textarea>
            </div>
            
            <div class="gwt-section when-section">
                <label class="gwt-label">When</label>
                <textarea class="when-textarea" placeholder="Action or event that occurs...">${when}</textarea>
            </div>
            
            <div class="gwt-section then-section">
                <label class="gwt-label">Then</label>
                <textarea class="then-textarea" placeholder="Expected outcome or result...">${then}</textarea>
            </div>
        `;
        
        scenarioList.appendChild(scenarioItem);
        
        
        scenarioItem.querySelector('.remove-btn').addEventListener('click', function() {
            if (confirm('Are you sure you want to remove this scenario?')) {
                scenarioItem.remove();
            }
        });
    }

    // Function to generate the final GWT test cases
    function generateGWTTests(userStory, scenarios) {
        let output = `\n\n`;
        
        output += `Scenarios in Given-When-Then format:\n\n`;
        scenarios.forEach((scenario, index) => {
            output += `Scenario ${index + 1}:\n`;
            output += `Given ${scenario.given}\n`;
            output += `When ${scenario.when}\n`;
            output += `Then ${scenario.then}\n\n`;
        });
        
        
        output += `\n\n`;
        output +=  `Your Tests :`;
        output += `\n\n\n\n\n\n\n\n\n\n\n\n`;
        
        
        resultsDiv.textContent = output;
    }
});