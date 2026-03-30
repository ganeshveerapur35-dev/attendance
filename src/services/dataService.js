import { supabase } from './supabaseClient'

// Teachers
export const getTeachers = async () => {
  const { data, error } = await supabase
    .from('teachers')
    .select('*')
    .order('name')
  if (error) throw error
  return data
}

export const addTeacher = async (teacher) => {
  const { data, error } = await supabase
    .from('teachers')
    .insert([teacher])
    .select()
  if (error) throw error
  return data[0]
}

export const updateTeacher = async (id, updates) => {
  const { data, error } = await supabase
    .from('teachers')
    .update(updates)
    .eq('id', id)
    .select()
  if (error) throw error
  return data[0]
}

export const deleteTeacher = async (id) => {
  const { error } = await supabase
    .from('teachers')
    .delete()
    .eq('id', id)
  if (error) throw error
}

// Students
export const getStudents = async () => {
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .order('name')
  if (error) throw error
  return data
}

export const addStudent = async (student) => {
  const { data, error } = await supabase
    .from('students')
    .insert([student])
    .select()
  if (error) throw error
  return data[0]
}

export const updateStudent = async (id, updates) => {
  const { data, error } = await supabase
    .from('students')
    .update(updates)
    .eq('id', id)
    .select()
  if (error) throw error
  return data[0]
}

export const deleteStudent = async (id) => {
  const { error } = await supabase
    .from('students')
    .delete()
    .eq('id', id)
  if (error) throw error
}

// Attendance
export const getAttendance = async (date, class_name) => {
  let query = supabase
    .from('attendance')
    .select(`
      *,
      students (name, class, section)
    `)
  
  if (date) query = query.eq('date', date)
  if (class_name) query = query.filter('students.class', 'eq', class_name)
  
  const { data, error } = await query
  if (error) throw error
  return data
}

export const markAttendance = async (attendanceRecords) => {
  const { data, error } = await supabase
    .from('attendance')
    .upsert(attendanceRecords)
    .select()
  if (error) throw error
  return data
}

// Notifications
export const getNotifications = async () => {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export const sendNotification = async (notification) => {
  const { data, error } = await supabase
    .from('notifications')
    .insert([notification])
    .select()
  if (error) throw error
  return data[0]
}

// Settings
export const getSettings = async () => {
  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .limit(1)
  if (error) throw error
  return data && data.length > 0 ? data[0] : null
}

export const updateSettings = async (updates) => {
  const { data, error } = await supabase
    .from('settings')
    .upsert(updates)
    .select()
  if (error) throw error
  return data[0]
}
