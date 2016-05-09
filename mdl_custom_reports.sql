SELECT 
CONCAT (u.firstname, u.lastname) Name, 
d1.data Cohort,
d2.data School,
d3.data Unit,
d4.data Instructor,
d5.data Days,
IF (ROUND(g.finalgrade / g.rawgrademax * 100, 2) > 79, 'Yes', 'No') Complete

FROM prefix_user u 
LEFT JOIN prefix_user_info_data d1 ON d1.userid = u.id 
LEFT JOIN prefix_user_info_field f1 ON f1.id = d1.fieldid AND f1.shortname = "Cohort"
LEFT JOIN prefix_user_info_data d2 ON d2.userid = u.id 
LEFT JOIN prefix_user_info_field f2 ON d2.fieldid = f2.id AND f2.shortname = "School"
LEFT JOIN prefix_user_info_data d3 ON d3.userid = u.id 
LEFT JOIN prefix_user_info_field f3 ON d3.fieldid = f3.id AND f3.shortname = "Unit"
LEFT JOIN prefix_user_info_data d4 ON d4.userid = u.id 
LEFT JOIN prefix_user_info_field f4 ON d4.fieldid = f4.id AND f4.shortname = "Instructor"
LEFT JOIN prefix_user_info_data d5 ON d5.userid = u.id 
LEFT JOIN prefix_user_info_field f5 ON d5.fieldid = f5.id AND f5.shortname = "Days"
LEFT JOIN prefix_user_info_data d6 ON d6.userid = u.id 
LEFT JOIN prefix_user_info_field f6 ON d6.fieldid = f6.id AND f6.shortname = "Client"
JOIN prefix_grade_grades g ON g.userid = u.id

GROUP BY u.id
ORDER BY `Name` ASC

__________________________________________________________

SELECT 
CONCAT (u.firstname, u.lastname) Name, 
f1.shortname Field, 
d1.data Data, 
IF (ROUND(g.finalgrade / g.rawgrademax * 100, 2) > 79, 'Yes', 'No') Complete 

FROM prefix_user_info_field f1 
LEFT JOIN prefix_user_info_data d1 ON f1.id = d1.fieldid AND f1.shortname = "Unit" 
LEFT JOIN prefix_user u ON d1.userid = u.id 


JOIN prefix_grade_grades g ON g.userid = u.id 

GROUP BY u.id 
ORDER BY `Name`

JOIN prefix_user_enrolments e7 on u.id = e7.userid 
JOIN 

__________________________________________________________

SELECT u.firstname AS 'First' , u.lastname AS 'Last', u.firstname + ' ' + u.lastname AS 'Display Name', 
c.fullname AS 'Course', 
cc.name AS 'Category',

CASE 
  WHEN gi.itemtype = 'course' 
   THEN c.fullname + ' Course Total'
  ELSE gi.itemname
END AS 'Item Name',
 
ROUND(gg.finalgrade,2) AS Grade,
DATE_ADD('1970-01-01', INTERVAL gi.timemodified SECOND) AS TIME
 
FROM prefix_course AS c
JOIN prefix_context AS ctx ON c.id = ctx.instanceid
JOIN prefix_role_assignments AS ra ON ra.contextid = ctx.id
JOIN prefix_user AS u ON u.id = ra.userid
JOIN prefix_grade_grades AS gg ON gg.userid = u.id
JOIN prefix_grade_items AS gi ON gi.id = gg.itemid
JOIN prefix_course_categories AS cc ON cc.id = c.category
 
WHERE  gi.courseid = c.id 
ORDER BY lastname