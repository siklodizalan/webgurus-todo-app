export type PriorityType = "High" | "Medium" | "Low";

export default interface TodoData {
  _id: string;
  name: string;
  priority: PriorityType;
  completed: boolean;
}
