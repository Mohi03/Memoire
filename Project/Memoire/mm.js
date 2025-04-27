function printScenarioWithTitleAndContent(msg) {
    const scenarios = msg.split(/(?=\*\*Scenario \d+:)/).filter(scenario => scenario.trim() !== "");
  
    scenarios.forEach(scenario => {
      const titleMatch = scenario.match(/\*\*Scenario \d+:\s*(.*?)\*\*/);
      if (titleMatch && titleMatch[1]) {
        const title = titleMatch[1].trim();
        console.log(`**Scenario Title:** ${title}\n`);
  
        // Remove the title part from the scenario content
        const contentWithoutTitle = scenario.replace(titleMatch[0], '').trim();
        const lines = contentWithoutTitle.split('\n').filter(line => line.trim() !== '');
        lines.forEach(line => {
          console.log(`* ${line.trim()}`);
        });
        console.log('\n');
      }
    });
  }
  
  const message = `**Scenario 1: Successful Withdrawal**
  
  * **Given** the ATM is operational and contains sufficient funds
  * **And** I have a valid ATM card inserted and authenticated
  * **And** my account balance is $500
  * **When** I select "Withdraw Cash"
  * **And** I select "Amount: $100"
  * **And** I confirm the transaction
  * **Then** $100 cash is dispensed from the ATM
  * **And** my account balance is updated to $400
  * **And** I receive a transaction receipt
  
  **Scenario 2: Insufficient Funds**
  
  * **Given** the ATM is operational
  * **And** I have a valid ATM card inserted and authenticated
  * **And** my account balance is $50
  * **When** I select "Withdraw Cash"
  * **And** I select "Amount: $100"
  * **And** I confirm the transaction
  * **Then** the ATM displays "Insufficient Funds" error message
  * **And** no cash is dispensed
  * **And** my account balance remains unchanged
  * **And** I am given the option to cancel the transaction or enter a different amount`;
  
  printScenarioWithTitleAndContent(message);