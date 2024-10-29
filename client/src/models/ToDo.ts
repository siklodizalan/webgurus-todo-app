export type PriorityType = "High" | "Medium" | "Low";

export default interface TodoData {
  _id: string;
  name: string;
  completed: boolean;
  priority: PriorityType;
}
