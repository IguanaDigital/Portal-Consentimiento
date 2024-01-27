import { NgModule } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { FlatpickrModule } from 'angularx-flatpickr';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { QuillModule } from 'ngx-quill';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { FeatherModule } from 'angular-feather';

import { AppsRoutes } from './apps.routing';

import { ChatComponent } from './chat/chat.component';
import { TicketsComponent } from './ticketlist/tickets.component';
import { TicketdetailsComponent } from './ticketdetails/ticketdetails.component';
import { TaskboardComponent } from './taskboard/taskboard.component';
import { FullcalendarComponent } from './fullcalendar/fullcalendar.component';

import { TodosComponent } from './todos/todos.component';
import { NotesComponent } from './notes/notes.component';

// new
import { TasksComponent } from './tasks/tasks.component';
import { ContactListComponent } from './contact-list/contact-list.component';
import { MailboxComponent } from './mail/mailbox.component';
import { ListingComponent } from './mail/listing/listing.component';
import { DetailComponent } from './mail/detail/detail.component';
import { ComposeComponent } from './mail/compose/compose.component';

import { ContactComponent } from './contact/contact.component';
import { ContactsComponent } from './contacts/contacts.component';
import { ListUsersComponent } from './users/list-users/list-users.component';
import { EditAddUserComponent } from './users/edit-add-user/edit-add-user.component';


// Job search
import { JobsListComponent } from './jobs/jobs-list/jobs-list.component';
import { JobDetailComponent } from './jobs/job-detail/job-detail.component';
import { JobApplyComponent } from './jobs/job-apply/job-apply.component';
import { ServicejobService } from './jobs/servicejob.service';

import { TicketService } from './ticketlist/tickets.service';
import { TimeAgoPipe } from './ticketlist/date-ago.pipe';
import { ContactService } from './contacts/contact.service';
import { NoteService } from './notes/note.service';
import { TodoService } from './todos/todo.service';
import { UserService } from './users/userService.service';
import { TasksService } from './tasks/tasks-service.service';

// New
import { MailGlobalVariable } from './mail/mail.service';
import { MailService } from './mail/mailService';

// rxjs
import { UserRxjsComponent } from './user-rxjs/user-rxjs.component';
import { UserRxjsServiceService } from './user-rxjs/user-rxjs-service.service';
import { ContactRxjsComponent } from './contact-rxjs/contact-rxjs.component';
import { ServiceContactrxjsService } from './contact-rxjs/service-contactrxjs.service';
import { ContactListRxjsComponent } from './contact-list-rxjs/contact-list-rxjs.component';
import { ServiceContactlistRxjsService } from './contact-list-rxjs/service-contactlist-rxjs.service';


import { InvoiceService } from './invoice/invoice.service';
import { AddInvoiceComponent } from './invoice/add-invoice/add-invoice.component';
import { ListInvoicesComponent } from './invoice/list-invoices/list-invoices.component';
import { ViewInvoiceComponent } from './invoice/view-invoice/view-invoice.component';
import { EditInvoiceComponent } from './invoice/edit-invoice/edit-invoice.component';




@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgbModule,
        NgbModalModule,
        CalendarModule.forRoot({
            provide: DateAdapter,
            useFactory: adapterFactory
        }),
        QuillModule.forRoot(),
        RouterModule.forChild(AppsRoutes),
        PerfectScrollbarModule,
        Ng2SearchPipeModule,
        DragDropModule,
        FlatpickrModule.forRoot(),
        HttpClientModule,
        FeatherModule
    ],
    declarations: [
        ChatComponent,
        TicketsComponent,
        TicketdetailsComponent,
        TaskboardComponent,
        TodosComponent,
        ContactComponent,
        ContactsComponent,
        FullcalendarComponent,
        NotesComponent,
        TimeAgoPipe,
        ListUsersComponent,
        EditAddUserComponent,
        TasksComponent,
        ContactListComponent,
        MailboxComponent,
        ListingComponent,
        DetailComponent,
        ComposeComponent,
        UserRxjsComponent,
        ContactRxjsComponent,
        ContactListRxjsComponent,
        AddInvoiceComponent,
        ListInvoicesComponent,
        ViewInvoiceComponent,
        EditInvoiceComponent,   
        JobsListComponent,
    JobDetailComponent,
    JobApplyComponent,
    ],
    providers: [
        ContactService,
        NoteService,
        TodoService,
        UserService,
        DatePipe,
        TicketService,
        DecimalPipe,
        TasksService,
        MailService,
        MailGlobalVariable,
        UserRxjsServiceService,
        ServiceContactrxjsService,
        ServiceContactlistRxjsService,
        InvoiceService,
        ServicejobService

    ]
})
export class AppsModule { }
