package app.llcloud.stories

import org.junit.Assert.assertEquals
import org.junit.Test

class CounterViewModelTest {
    @Test
    fun increment_increasesCount() {
        val viewModel = CounterViewModel()
        viewModel.increment()
        assertEquals(1, viewModel.count.value)
    }

    @Test
    fun decrement_decreasesCount() {
        val viewModel = CounterViewModel()
        viewModel.decrement()
        assertEquals(-1, viewModel.count.value)
    }

    @Test
    fun multipleIncrements_accumulate() {
        val viewModel = CounterViewModel()
        repeat(3) { viewModel.increment() }
        assertEquals(3, viewModel.count.value)
    }
}
