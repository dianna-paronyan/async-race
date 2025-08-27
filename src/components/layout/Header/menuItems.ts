export interface MenuItem {
  key: number;
  label: string;
  to: string;
}

export const menuItems: MenuItem[] = [
  {
    key: 1,
    label: 'Garage',
    to: '/',
  },
  {
    key: 2,
    label: 'Winners',
    to: '/winners',
  },
];
