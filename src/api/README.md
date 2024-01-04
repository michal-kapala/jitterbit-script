# API

All the system variables are supported at runtime, initialized with null or default values.

All the functions are supported by the parser which enables static type checking for function calls.

The only exceptions to that rule are database module tags:
- [`<SEQUENCE>`](https://success.jitterbit.com/cloud-studio/cloud-studio-reference/functions/database-functions/#databasefunctions-database-functions-sequence)
- [`<SQLIDENTITY>`](https://success.jitterbit.com/cloud-studio/cloud-studio-reference/functions/database-functions/#databasefunctions-database-functions-sqlidentity)
- [`<UDF>`](https://success.jitterbit.com/cloud-studio/cloud-studio-reference/functions/database-functions/#databasefunctions-database-functions-udf)

## Function runtime support

Below you can find all the available modules with runtime support status for individual functions.

This file serves as a tracker and should be updated with new implementations.

### Cache

| Function | Runtime support |
|---|---|
| ReadCache | ❌ |
| WriteCache | ❌ |

### Conversion

| Function | Runtime support |
|---|---|
| BinaryToHex | ✔️ |
| BinaryToUUID | ✔️ |
| Bool | ✔️ |
| Date | ✔️ |
| Double | ✔️ |
| Float | ✔️ |
| HexToBinary | ✔️ |
| HexToString | ✔️ |
| Int | ✔️ |
| Long | ✔️ |
| String | ✔️ |
| StringToHex | ✔️ |
| UUIDToBinary | ✔️ |

### Crypto

| Function | Runtime support |
|---|---|
| AESDecryption | ❌ |
| AESEncryption | ❌ |
| Base64Decode | ❌ |
| Base64Encode | ❌ |
| Base64EncodeFile | ❌ |
| MD5 | ❌ |
| MD5AsTwoNumbers | ❌ |
| SHA256 | ❌ |

### Database

| Function | Runtime support |
|---|---|
| CallStoredProcedure | ❌ |
| DBCloseConnection | ❌ |
| DBExecute | ❌ |
| DBLoad | ❌ |
| DBLookup | ❌ |
| DBLookupAll | ❌ |
| DBRollbackTransaction | ❌ |
| DBWrite | ❌ |
| SetDBInsert | ❌ |
| SetDBUpdate | ❌ |
| SQLEscape | ❌ |
| Unmap | ❌ |
| `<SEQUENCE>` | ❌ |
| `<SQLIDENTITY>` | ❌ |
| `<UDF>` | ❌ |

### Date and time

| Function | Runtime support |
|---|---|
| ConvertTimeZone | ❌ |
| CVTDate | ❌ |
| DateAdd | ❌ |
| DayOfMonth | ✔️ |
| DayOfWeek | ✔️ |
| FormatDate | ❌ |
| GeneralDate | ✔️ |
| GetUTCFormattedDate | ❌ |
| GetUTCFormattedDateTime | ❌ |
| LastDayOfMonth | ✔️ |
| LongDate | ✔️ |
| LongTime | ✔️ |
| MediumDate | ✔️ |
| MediumTime | ✔️ |
| MonthOfYear | ✔️ |
| Now | ✔️ |
| Now_ | ✔️ |
| ShortDate | ✔️ |
| ShortTime | ✔️ |

### Debugging

| Function | Runtime support |
|---|---|
| DebugBreak | ✔️ |

### Dictionaries and arrays

| Function | Runtime support |
|---|---|
| AddToDict | ✔️ |
| Array | ✔️ |
| Collection | ✔️ |
| CollectValues | ✔️ |
| Dict | ✔️ |
| GetKeys | ✔️ |
| GetSourceAttrNames | ❌ |
| GetSourceElementNames | ❌ |
| GetSourceInstanceArray | ❌ |
| GetSourceInstanceElementArray | ❌ |
| GetSourceInstanceMap | ❌ |
| GetSourceInstanceElementMap | ❌ |
| HasKey | ✔️ |
| Map | ✔️ |
| MapCache | ✔️ |
| ReduceDimension | ✔️ |
| RemoveKey | ✔️ |
| SortArray | ✔️ |

### Diff

| Function | Runtime support |
|---|---|
| DiffAdd | ❌ |
| DiffComplete | ❌ |
| DiffDelete | ❌ |
| DiffKeyList | ❌ |
| DiffNode | ❌ |
| DiffUpdate | ❌ |
| InitializeDiff | ❌ |
| OrderedDiffKeyList | ❌ |
| ResetDiff | ❌ |
| SetDiffChunkSize | ❌ |

### Email

| Function | Runtime support |
|---|---|
| SendEmail | ❌ |
| SendEmailMessage | ❌ |
| SendSystemEmail | ❌ |

### Environment information

| Function | Runtime support |
|---|---|
| GetAgentGroupID | ❌ |
| GetAgentGroupName | ❌ |
| GetAgentID | ❌ |
| GetAgentName | ❌ |
| GetAgentVersionID | ❌ |
| GetAgentVersionName | ❌ |
| GetEnvironmentID | ❌ |
| GetEnvironmentName | ❌ |
| GetOrganizationID | ❌ |
| GetOrganizationName | ❌ |

### File

| Function | Runtime support |
|---|---|
| ArchiveFile | ❌ |
| DeleteFile | ❌ |
| DeleteFiles | ❌ |
| DirList | ❌ |
| FileList | ❌ |
| FlushAllFiles | ❌ |
| FlushFile | ❌ |
| ReadFile | ❌ |
| WriteFile | ❌ |

### General

| Function | Runtime support |
|---|---|
| ArgumentList | ❌ |
| AutoNumber | ❌ |
| CancelOperation | ❌ |
| CancelOperationChain | ❌ |
| Eval | ❌ |
| Get | ❌ |
| GetChunkDataElement | ❌ |
| GetHostByIP | ❌ |
| GetInputString | ❌ |
| GetLastOperationRunStartTime | ❌ |
| GetName | ❌ |
| GetOperationQueue | ❌ |
| GetServerName | ✔️ |
| GUID | ✔️ |
| IfEmpty | ❌ |
| IfNull | ❌ |
| InitCounter | ❌ |
| InList | ❌ |
| IsInteger | ✔️ |
| IsNull | ✔️ |
| IsValid | ✔️ |
| Length | ✔️ |
| Null | ✔️ |
| Random | ✔️ |
| RandomString | ✔️ |
| ReadArrayString | ❌ |
| RecordCount | ❌ |
| ReRunOperation | ❌ |
| RunOperation | ❌ |
| RunPlugin | ❌ |
| RunScript | ❌ |
| Set | ❌ |
| SetChunkDataElement | ❌ |
| Sleep | ❌ |
| SourceInstanceCount | ❌ |
| TargetInstanceCount | ❌ |
| WaitForOperation | ❌ |

### Instance

| Function | Runtime support |
|---|---|
| Count | ❌ |
| CountSourceRecords | ❌ |
| Exist | ❌ |
| FindByPos | ❌ |
| FindValue | ❌ |
| GetInstance | ❌ |
| Max | ❌ |
| Min | ❌ |
| ResolveOneOf | ❌ |
| SetInstances | ❌ |
| SortInstances | ❌ |
| Sum | ❌ |
| SumCSV | ❌ |
| SumString | ❌ |

### LDAP

| Function | Runtime support |
|---|---|
| ArrayToMultipleValues | ❌ |
| LDAPAdd | ❌ |
| LDAPConnect | ❌ |
| LDAPDeleteEntry | ❌ |
| LDAPExecute | ❌ |
| LDAPRemove | ❌ |
| LDAPRename | ❌ |
| LDAPReplace | ❌ |
| LDAPSearch | ❌ |

### Logging and errors

| Function | Runtime support |
|---|---|
| GetLastError | ✔️ |
| RaiseError | ✔️ |
| ResetLastError | ✔️ |
| SetLastError | ✔️ |
| WriteToOperationLog | ✔️ |

### Logical

| Function | Runtime support |
|---|---|
| Case | ✔️ |
| Equal | ✔️ |
| If | ✔️ |
| While | ✔️ |

### Math

| Function | Runtime support |
|---|---|
| Ceiling | ✔️ |
| Exp | ✔️ |
| Floor | ✔️ |
| Log | ✔️ |
| Log10 | ✔️ |
| Mod | ✔️ |
| Pow | ✔️ |
| Round | ✔️ |
| RoundToInt | ✔️ |
| Sqrt | ✔️ |

### NetSuite

| Function | Runtime support |
|---|---|
| NetSuiteGetSelectValue | ❌ |
| NetSuiteGetServerTime | ❌ |
| NetSuiteLogin | ❌ |

### Salesforce

| Function | Runtime support |
|---|---|
| GetSalesforceTimestamp | ❌ |
| LoginToSalesforceAndGetTimeStamp | ❌ |
| SalesforceLogin | ❌ |
| SetSalesforceSession | ❌ |
| SfCacheLookup | ❌ |
| SfLookup | ❌ |
| SfLookupAll | ❌ |
| SfLookupAllToFile | ❌ |

### String

| Function | Runtime support |
|---|---|
| CountSubString | ✔️ |
| DQuote | ✔️ |
| Format | ❌ |
| Index | ❌ |
| IsValidString | ✔️ |
| Left | ✔️ |
| LPad | ✔️ |
| LPadChar | ✔️ |
| LTrim | ✔️ |
| LTrimChars | ✔️ |
| Mid | ✔️ |
| ParseURL | ✔️ |
| Quote | ✔️ |
| RegExMatch | ✔️ |
| RegExReplace | ❌ |
| Replace | ✔️ |
| Right | ✔️ |
| RPad | ✔️ |
| RPadChar | ✔️ |
| RTrim | ✔️ |
| RTrimChars | ✔️ |
| Split | ✔️ |
| SplitCSV | ❌ |
| StringLength | ✔️ |
| ToLower | ✔️ |
| ToProper | ❌ |
| ToUpper | ✔️ |
| Trim | ✔️ |
| TrimChars | ✔️ |
| Truncate | ✔️ |
| URLDecode | ✔️ |
| URLEncode | ✔️ |

### Text

| Function | Runtime support |
|---|---|
| Validate | ❌ |

### XML

| Function | Runtime support |
|---|---|
| Attribute | ❌ |
| CreateNode | ❌ |
| GetNodeName | ❌ |
| GetNodeValue | ❌ |
| GetXMLString | ❌ |
| IsNil | ❌ |
| RunXSLT | ❌ |
| SelectNodeFromXMLAny | ❌ |
| SelectNodes | ❌ |
| SelectNodesFromXMLAny | ❌ |
| SelectSingleNode | ❌ |
