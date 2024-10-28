export type PriorityType = "High" | "Medium" | "Low" | null;

export default interface TodoData {
  _id: string;
  name: string;
  completed: boolean;
  priority: PriorityType;
}
