import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './components/home/home.component';
import {LoginComponent} from './components/login/login.component';
import {GameComponent} from './components/game/game.component';
import {SignUpComponent} from './components/sign-up/sign-up.component';
import {ProfileComponent} from './components/profile/profile.component';
import {ChangeProfileComponent} from './components/changeprofile/changeprofile.component'
import {LeaderBoardComponent} from './components/leader-board/leader-board.component';
import { ImprintComponent } from './components/imprint/imprint.component';
import { DataProtectionComponent } from './components/data-protection/data-protection.component';
import {AuthGuard} from './guards/auth.guard';
import { GameDescriptionComponent } from './components/game-description/game-description.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'sign-up', component: SignUpComponent},
  {path: 'game', canActivate: [AuthGuard], component: GameComponent},
  {path: 'profile', canActivate: [AuthGuard], component: ProfileComponent},
  {path: 'leader-board', canActivate:[AuthGuard], component: LeaderBoardComponent},
  {path: 'changeprofile', canActivate: [AuthGuard], component: ChangeProfileComponent},
  {path: 'data-protection', component: DataProtectionComponent},
  {path: 'game-description', component: GameDescriptionComponent},
  {path: 'imprint', component: ImprintComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
