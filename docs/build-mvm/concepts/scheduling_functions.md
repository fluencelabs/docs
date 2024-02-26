# Scheduling Fluence Functions

## Introduction

Like most serverless function, Fluence compute functions sit idle unless invoked. For the most part, event-based triggers will do the job, **link** to js-client.  However, time-based triggers, such as cronjobs to poll some resource or simply wake up some other function at some pre-determined interval, are also a common source of function invocation.

The Fluence Cloudless platform accommodates time-based triggers via Cloudless Scheduled Functions (aka spells).