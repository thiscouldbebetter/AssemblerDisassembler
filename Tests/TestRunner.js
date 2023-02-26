class TestRunner
{
	constructor(testFixtures)
	{
		this.testFixtures = testFixtures;
	}

	runAllTests()
	{
		this.messageWrite("Running " + this.testFixtures.length + " test fixture(s)...");

		var testRunner = this;

		var testsFailedCountSoFar = 0;

		this.testFixtures.forEach(testFixture =>
		{
			var tests = testFixture.tests;

			this.messageWrite("Running fixture '" + testFixture.name + "', containing " + tests.length + " test(s)...");

			var testsInFixtureFailedSoFar = [];

			tests.forEach(test =>
			{
				try
				{
					test.call(testFixture);
					testRunner.messageWrite("Test passed: " + test.name + ".");
				}
				catch (ex)
				{
					testsInFixtureFailedSoFar.push(test);
					testsFailedCountSoFar++;
					testRunner.messageWrite
					(
						"Test failed: " + test.name + ", with error: " + ex.message
					);
					throw ex;
				}
			});

			if (testsInFixtureFailedSoFar.length == 0)
			{
				testRunner.messageWrite("All tests in fixture passed.");
			}
			else
			{
				testRunner.messageWrite(testsInFixtureFailedSoFar.length + "tests in fixture FAILED!");
			}

			this.messageWrite("...done running fixture '" + testFixture.name + "'.");

		});

		this.messageWrite("...done running test fixtures.");
		this.messageWrite(testsFailedCountSoFar + " tests failed.");

	}

	messageWrite(message)
	{
		console.log(message);
		document.write(message + "<br />");
	}
}
