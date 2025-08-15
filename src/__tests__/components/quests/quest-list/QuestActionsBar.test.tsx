import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import QuestActionsBar from "../../../../components/quests/quest-list/QuestActionsBar";

test("calls onAddNew when button is clicked", async () => {
  const onAddNew = vi.fn();
  render(<QuestActionsBar addButtonText="Add" onAddNew={onAddNew} />);
  await userEvent.click(screen.getByRole("button", { name: /add/i }));
  expect(onAddNew).toHaveBeenCalled();
});
