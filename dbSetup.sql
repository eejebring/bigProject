create table if not exists roles
(
    roleID int primary key autoincrement,
    title varchar(32) not null
);

insert into roles (title) VALUES
('User'),
('Admin');

create table if not exists account
(
    accountID integer primary key autoincrement,
    roleID integer default 1 not null,
    username varchar(20) not null,
    nickname varchar(25),
    password char(60) not null,
    hasImage boolean default false not null,
    foreign key (roleID) references roles(roleID)
);

/*create user admin with the password: password*/

insert into account (roleID, username, password) values
(2,'admin','$2a$12$2.zx8ECdvZHJKcE0pZuYVOQW2jEjoBQYDlNzCfQng7QCohMIPFzu6');

select username from account;

create table if not exists thread
(
    threadID integer primary key autoincrement,
    ownerID integer not null,
    title varchar(64) not null,
    context varchar(512),
    views integer default 0 not null,
    age datetime default current_timestamp not null,
    foreign key (ownerID) references account(accountID)
);

update account set password

create table if not exists comment
(
    commentID integer primary key autoincrement,
    ownerID integer not null,
    threadID integer not null,
    content varchar(255) not null,
    foreign key (ownerID) references account(accountID),
    foreign key (threadID) references thread(threadID)
);

select accountID, username, password from account;

select username,title from account
join roles r on account.roleID = r.roleID;

drop table account;

select username, nickname, hasImage, title  from account as A
join roles as J on A.roleID = J.roleID
where accountID = 1;

update account
set nickname = 'srfhaapfijmnnp'
where accountID = 1
