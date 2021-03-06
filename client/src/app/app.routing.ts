import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { LoginComponent } from './components/login/login.component';
import { ItemsComponent } from './components/items/items.component';
import { ItemDetailsComponent } from './components/item-details/item-details.component';
import {SignUpComponent} from './components/sign-up/sign-up.component';
import { AccountBalanceActivityComponent } from './components/account-balance-activity/account-balance-activity.component';

const appRoutes: Routes = [
  { path: `items`, component: ItemsComponent },
  { path: `item/:itemID`, component: ItemDetailsComponent },
  { path: `signUp`, component: SignUpComponent },
  { path: `login`, component: LoginComponent },
  { path: `accountDetails`, component: AccountBalanceActivityComponent},
  { path: `**`, redirectTo: `items` }  // otherwise redirect to items
];

export const appRoutingProviders: any[] = [];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
