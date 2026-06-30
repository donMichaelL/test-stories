package app.llcloud.stories

import androidx.compose.ui.test.assertIsDisplayed
import androidx.compose.ui.test.junit4.createComposeRule
import androidx.compose.ui.test.onNodeWithText
import androidx.compose.ui.test.performClick
import app.llcloud.stories.ui.theme.StoriesTheme
import org.junit.Rule
import org.junit.Test

class CounterScreenTest {
    @get:Rule
    val composeRule = createComposeRule()

    @Test
    fun plusButton_incrementsDisplayedCount() {
        composeRule.setContent {
            StoriesTheme {
                CounterScreen()
            }
        }
        composeRule.onNodeWithText("0").assertIsDisplayed()
        composeRule.onNodeWithText("+").performClick()
        composeRule.onNodeWithText("1").assertIsDisplayed()
    }

    @Test
    fun minusButton_decrementsDisplayedCount() {
        composeRule.setContent {
            StoriesTheme {
                CounterScreen()
            }
        }
        composeRule.onNodeWithText("+").performClick()
        composeRule.onNodeWithText("−").performClick()
        composeRule.onNodeWithText("0").assertIsDisplayed()
    }
}
