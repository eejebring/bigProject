create table if not exists roles
(
    roleID int primary key autoincrement,
    title varchar(32) not null
);

/*
insert into roles (title) VALUES
('User'),
('Admin');
 */

create table if not exists account
(
    accountID integer primary key autoincrement,
    roleID integer default 1 not null,
    username varchar(20) not null,
    nickname varchar(25),
    password char(60) not null,
    foreign key (roleID) references roles(roleID)
);

/*create user admin with the password: password*/
/*
insert into account (roleID, username, password) values
(2,'admin','$2a$12$2.zx8ECdvZHJKcE0pZuYVOQW2jEjoBQYDlNzCfQng7QCohMIPFzu6');
 */

create table if not exists topic
(
    topicID integer primary key autoincrement,
    ownerID integer not null,
    title varchar(64) not null,
    context varchar(512),
    views integer default 0 not null,
    age datetime default current_timestamp not null,
    foreign key (ownerID) references account(accountID)
);

create table if not exists comment
(
    commentID integer primary key autoincrement,
    ownerID integer not null,
    topicID integer not null,
    content varchar(255) not null,
    foreign key (ownerID) references account(accountID),
    foreign key (topicID) references topic(topicID)
);