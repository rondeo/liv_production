export class Login {
  username: string;
  password: string;
  browser_details: object;
}

export class LoginResponse {
  success: boolean;
  message: string;
  user_data: {
    roles: {
      menu_tab: Array<{
        path: string;
      }>;
    };
    name: string;
    token: string;
    user_id: string;
    user_name: string;
    user_type: string;
  };
}
